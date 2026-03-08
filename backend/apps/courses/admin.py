from django.contrib import admin

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


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1


class ResourceInline(admin.TabularInline):
    model = Resource
    extra = 1


@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "updated_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title",)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "course_type", "pricing_model", "is_published", "featured")
    list_filter = ("category", "course_type", "pricing_model", "is_published", "featured")
    search_fields = ("title", "short_description", "full_description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [LessonInline, ResourceInline]


@admin.register(EnrollmentApplication)
class EnrollmentApplicationAdmin(admin.ModelAdmin):
    list_display = ("name", "course", "status", "quoted_price", "preferred_contact_whatsapp", "created_at")
    list_filter = ("status", "preferred_contact_whatsapp", "agreed_via_whatsapp")
    search_fields = ("name", "email", "phone", "course__title")


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "status", "agreed_price", "created_at")
    list_filter = ("status",)
    search_fields = ("user__email", "user__full_name", "course__title")


@admin.register(PaymentRecord)
class PaymentRecordAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "enrollment", "amount_due", "amount_paid", "status", "payment_method")
    list_filter = ("status", "payment_method")
    search_fields = ("invoice_number", "transaction_reference", "enrollment__user__email", "enrollment__course__title")


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "is_completed", "last_position_seconds", "updated_at")
    list_filter = ("is_completed",)
