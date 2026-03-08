from django.db.models import Q
from rest_framework import serializers

from apps.courses.models import (
    Course,
    CourseCategory,
    Enrollment,
    EnrollmentApplication,
    Lesson,
    LessonProgress,
    PaymentRecord,
    Resource,
)
from apps.courses.utils import build_course_whatsapp_url


class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = ["id", "title", "slug", "description", "icon_name"]


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "description",
            "video_url",
            "video_type",
            "duration_minutes",
            "order",
            "is_free_preview",
            "is_published",
        ]


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            "id",
            "title",
            "description",
            "resource_type",
            "drive_link",
            "code_content",
            "is_downloadable",
            "visibility",
            "order",
        ]


class CourseListSerializer(serializers.ModelSerializer):
    category = CourseCategorySerializer(read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    lessons_count = serializers.SerializerMethodField()
    quiz_count = serializers.SerializerMethodField()
    price_display = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "short_description",
            "level",
            "duration",
            "instructor_name",
            "course_type",
            "pricing_model",
            "listed_price",
            "price_display",
            "featured",
            "is_published",
            "intro_video_url",
            "thumbnail_url",
            "lessons_count",
            "quiz_count",
        ]

    def get_thumbnail_url(self, obj):
        request = self.context.get("request")
        if not obj.thumbnail:
            return ""
        return request.build_absolute_uri(obj.thumbnail.url) if request else obj.thumbnail.url

    def get_lessons_count(self, obj):
        return obj.lessons.filter(is_published=True).count()

    def get_quiz_count(self, obj):
        return obj.quizzes.filter(is_published=True).count()

    def get_price_display(self, obj):
        return obj.price_display()


class CourseDetailSerializer(CourseListSerializer):
    lessons = serializers.SerializerMethodField()
    resources = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    progress_percent = serializers.SerializerMethodField()
    application_status = serializers.SerializerMethodField()
    latest_payment_status = serializers.SerializerMethodField()
    whatsapp_apply_url = serializers.SerializerMethodField()

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + [
            "full_description",
            "drive_folder_url",
            "code_overview",
            "trial_lesson_limit",
            "lessons",
            "resources",
            "is_enrolled",
            "progress_percent",
            "application_status",
            "latest_payment_status",
            "whatsapp_apply_url",
        ]

    def _has_full_access(self, obj):
        request = self.context.get("request")
        return obj.has_access_for(getattr(request, "user", None))

    def get_lessons(self, obj):
        queryset = obj.lessons.filter(is_published=True)
        if not self._has_full_access(obj):
            queryset = queryset.filter(is_free_preview=True)[: obj.trial_lesson_limit]
        return LessonSerializer(queryset, many=True).data

    def get_resources(self, obj):
        queryset = obj.resources.all()
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if user and user.is_authenticated and user.role == user.Roles.ADMIN:
            filtered = queryset
        elif self._has_full_access(obj):
            filtered = queryset.exclude(visibility=Resource.Visibility.ADMIN)
        else:
            filtered = queryset.filter(visibility=Resource.Visibility.PUBLIC)

        return ResourceSerializer(filtered, many=True).data

    def get_is_enrolled(self, obj):
        request = self.context.get("request")
        return obj.has_access_for(getattr(request, "user", None))

    def get_progress_percent(self, obj):
        request = self.context.get("request")
        return obj.get_progress_for(getattr(request, "user", None))

    def get_application_status(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return None
        application = obj.applications.filter(Q(user=user) | Q(email=user.email)).first()
        return application.status if application else None

    def get_latest_payment_status(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return None
        payment = PaymentRecord.objects.filter(
            enrollment__course=obj,
            enrollment__user=user,
        ).order_by("-created_at").first()
        return payment.status if payment else None

    def get_whatsapp_apply_url(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        return build_course_whatsapp_url(
            obj.title,
            getattr(user, "full_name", ""),
            getattr(user, "email", ""),
        )


class EnrollmentApplicationSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    whatsapp_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = EnrollmentApplication
        fields = [
            "id",
            "course",
            "course_title",
            "name",
            "email",
            "phone",
            "message",
            "preferred_contact_whatsapp",
            "agreed_via_whatsapp",
            "status",
            "quoted_price",
            "admin_notes",
            "pricing_notes",
            "whatsapp_url",
            "created_at",
        ]
        read_only_fields = ["status", "quoted_price", "admin_notes", "pricing_notes", "created_at"]

    def create(self, validated_data):
        request = self.context["request"]
        if request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)

    def get_whatsapp_url(self, obj):
        return build_course_whatsapp_url(obj.course.title, obj.name, obj.email)


class EnrollmentApplicationAdminSerializer(EnrollmentApplicationSerializer):
    class Meta(EnrollmentApplicationSerializer.Meta):
        read_only_fields = ["created_at"]


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    progress_percent = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "course",
            "status",
            "agreed_price",
            "activated_at",
            "expires_at",
            "progress_percent",
            "created_at",
        ]

    def get_progress_percent(self, obj):
        return obj.course.get_progress_for(obj.user)


class EnrollmentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ["id", "user", "course", "application", "approved_by", "status", "agreed_price", "activated_at", "expires_at"]


class PaymentRecordSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="enrollment.course.title", read_only=True)
    balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    invoice_url = serializers.SerializerMethodField()

    class Meta:
        model = PaymentRecord
        fields = [
            "id",
            "invoice_number",
            "course_title",
            "amount_due",
            "amount_paid",
            "balance",
            "due_date",
            "paid_at",
            "status",
            "payment_method",
            "transaction_reference",
            "proof_url",
            "notes",
            "invoice_url",
            "created_at",
        ]

    def get_invoice_url(self, obj):
        request = self.context.get("request")
        if not request:
            return ""
        return request.build_absolute_uri(f"/api/courses/payments/{obj.pk}/invoice/")


class PaymentRecordWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRecord
        fields = [
            "id",
            "enrollment",
            "amount_due",
            "amount_paid",
            "due_date",
            "paid_at",
            "status",
            "payment_method",
            "transaction_reference",
            "proof_url",
            "notes",
        ]


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ["id", "lesson", "is_completed", "last_position_seconds", "completed_at", "updated_at"]
        read_only_fields = ["completed_at", "updated_at"]

    def create(self, validated_data):
        progress, _ = LessonProgress.objects.update_or_create(
            user=self.context["request"].user,
            lesson=validated_data["lesson"],
            defaults={
                "is_completed": validated_data.get("is_completed", False),
                "last_position_seconds": validated_data.get("last_position_seconds", 0),
                "completed_at": validated_data.get("completed_at"),
            },
        )
        return progress
