from decimal import Decimal
import uuid

from django.conf import settings
from django.db import models

from common.models import TimeStampedModel
from common.utils import generate_unique_slug


class CourseCategory(TimeStampedModel):
    title = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=60, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(CourseCategory, self.title, self.pk)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Course(TimeStampedModel):
    class Levels(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"

    class CourseTypes(models.TextChoices):
        FREE = "free", "Free"
        PAID = "paid", "Paid"
        TRIAL = "trial", "Trial"

    class PricingModels(models.TextChoices):
        FIXED = "fixed", "Fixed"
        QUOTE = "quote", "WhatsApp Quote"
        HYBRID = "hybrid", "Listed Price + Quote"

    category = models.ForeignKey(CourseCategory, on_delete=models.PROTECT, related_name="courses")
    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    thumbnail = models.ImageField(upload_to="courses/thumbnails/", blank=True, null=True)
    short_description = models.CharField(max_length=255)
    full_description = models.TextField()
    level = models.CharField(max_length=20, choices=Levels.choices, default=Levels.BEGINNER)
    duration = models.CharField(max_length=80)
    instructor_name = models.CharField(max_length=120, default="Rashid Zada")
    listed_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    pricing_model = models.CharField(max_length=20, choices=PricingModels.choices, default=PricingModels.QUOTE)
    quote_label = models.CharField(max_length=120, default="Price confirmed on WhatsApp")
    course_type = models.CharField(max_length=20, choices=CourseTypes.choices, default=CourseTypes.PAID)
    intro_video_url = models.URLField(blank=True)
    drive_folder_url = models.URLField(blank=True)
    code_overview = models.TextField(blank=True)
    trial_lesson_limit = models.PositiveSmallIntegerField(default=3)
    featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ["-featured", "title"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_published", "featured"]),
            models.Index(fields=["course_type", "pricing_model"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Course, self.title, self.pk)
        super().save(*args, **kwargs)

    def has_access_for(self, user) -> bool:
        if not user or not user.is_authenticated:
            return False
        if user.role == user.Roles.ADMIN:
            return True
        if self.course_type == self.CourseTypes.FREE:
            return True
        return self.enrollments.filter(
            user=user,
            status__in=[Enrollment.Statuses.ACTIVE, Enrollment.Statuses.COMPLETED],
        ).exists()

    def get_progress_for(self, user) -> int:
        if not user or not user.is_authenticated:
            return 0
        total_lessons = self.lessons.filter(is_published=True).count()
        if total_lessons == 0:
            return 0
        completed = LessonProgress.objects.filter(
            user=user,
            lesson__course=self,
            lesson__is_published=True,
            is_completed=True,
        ).count()
        return int((completed / total_lessons) * 100)

    def price_display(self) -> str:
        if self.course_type == self.CourseTypes.FREE:
            return "Free"
        if self.pricing_model == self.PricingModels.QUOTE:
            return self.quote_label
        if self.listed_price is None:
            return self.quote_label
        if self.pricing_model == self.PricingModels.HYBRID:
            return f"From PKR {self.listed_price}"
        return f"PKR {self.listed_price}"

    def __str__(self):
        return self.title


class Lesson(TimeStampedModel):
    class VideoTypes(models.TextChoices):
        YOUTUBE = "youtube", "YouTube"
        DRIVE = "drive", "Google Drive"
        MP4 = "mp4", "MP4"
        EXTERNAL = "external", "External"

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    video_url = models.URLField()
    video_type = models.CharField(max_length=20, choices=VideoTypes.choices, default=VideoTypes.YOUTUBE)
    duration_minutes = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=1)
    is_free_preview = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ["order", "id"]
        unique_together = ("course", "order")

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Resource(TimeStampedModel):
    class ResourceTypes(models.TextChoices):
        PDF = "pdf", "PDF"
        DOC = "doc", "DOC"
        DOCX = "docx", "DOCX"
        ZIP = "zip", "ZIP"
        CODE = "code", "Code"
        NOTES = "notes", "Notes"
        SLIDES = "slides", "Slides"

    class Visibility(models.TextChoices):
        PUBLIC = "public", "Public"
        ENROLLED = "enrolled", "Enrolled"
        ADMIN = "admin", "Admin"

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="resources")
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=20, choices=ResourceTypes.choices)
    drive_link = models.URLField()
    code_content = models.TextField(blank=True)
    is_downloadable = models.BooleanField(default=True)
    visibility = models.CharField(max_length=20, choices=Visibility.choices, default=Visibility.ENROLLED)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self):
        return self.title


class EnrollmentApplication(TimeStampedModel):
    class Statuses(models.TextChoices):
        PENDING = "pending", "Pending"
        CONTACTED = "contacted", "Contacted"
        QUOTED = "quoted", "Quoted"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="applications")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="applications",
    )
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    message = models.TextField(blank=True)
    preferred_contact_whatsapp = models.BooleanField(default=True)
    agreed_via_whatsapp = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=Statuses.choices, default=Statuses.PENDING)
    quoted_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    admin_notes = models.TextField(blank=True)
    pricing_notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["email"]),
        ]

    def __str__(self):
        return f"{self.name} - {self.course.title}"


class Enrollment(TimeStampedModel):
    class Statuses(models.TextChoices):
        PENDING_PAYMENT = "pending_payment", "Pending Payment"
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        PAUSED = "paused", "Paused"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    application = models.OneToOneField(
        EnrollmentApplication,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="enrollment",
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="approved_enrollments",
    )
    status = models.CharField(max_length=20, choices=Statuses.choices, default=Statuses.PENDING_PAYMENT)
    agreed_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    activated_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("user", "course")

    def __str__(self):
        return f"{self.user.email} -> {self.course.title}"


class LessonProgress(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="progress_entries")
    is_completed = models.BooleanField(default=False)
    last_position_seconds = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ("user", "lesson")
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user.email} - {self.lesson.title}"


class PaymentRecord(TimeStampedModel):
    class Statuses(models.TextChoices):
        PENDING = "pending", "Pending"
        PARTIAL = "partial", "Partial"
        PAID = "paid", "Paid"
        REFUNDED = "refunded", "Refunded"

    class Methods(models.TextChoices):
        WHATSAPP = "whatsapp", "WhatsApp Deal"
        BANK = "bank", "Bank Transfer"
        EASYPAISA = "easypaisa", "Easypaisa"
        JAZZCASH = "jazzcash", "JazzCash"
        CASH = "cash", "Cash"

    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="payments")
    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    due_date = models.DateField(blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Statuses.choices, default=Statuses.PENDING)
    payment_method = models.CharField(max_length=20, choices=Methods.choices, default=Methods.WHATSAPP)
    transaction_reference = models.CharField(max_length=120, blank=True)
    proof_url = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    invoice_number = models.CharField(max_length=40, unique=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["status", "payment_method"])]

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            self.invoice_number = f"GGT-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)

    @property
    def balance(self):
        return self.amount_due - self.amount_paid

    def __str__(self):
        return self.invoice_number
