from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from apps.accounts.models import StudentProfile, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("email",)
    list_display = ("email", "full_name", "role", "is_active", "created_at")
    search_fields = ("email", "full_name", "phone_number")
    readonly_fields = ("last_login", "created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {"fields": ("full_name", "phone_number", "role", "is_email_verified")},
        ),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "full_name", "phone_number", "role", "password1", "password2"),
            },
        ),
    )


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "city", "qualification", "updated_at")
    search_fields = ("user__email", "user__full_name", "city", "qualification")
