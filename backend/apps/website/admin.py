from django.contrib import admin

from apps.website.models import FreeLearningVideo, HomepageContent, Testimonial


@admin.register(HomepageContent)
class HomepageContentAdmin(admin.ModelAdmin):
    list_display = ("site_name", "owner_name", "owner_email", "updated_at")
    fieldsets = (
        (
            "Homepage",
            {
                "fields": (
                    "site_name",
                    "tagline",
                    "hero_title",
                    "hero_subtitle",
                    "intro_text",
                    "intro_video_urls",
                    "why_choose_us",
                    "learning_modes",
                    "footer_note",
                )
            },
        ),
        (
            "About And Owner",
            {
                "fields": (
                    "about_title",
                    "about_description",
                    "owner_name",
                    "owner_role",
                    "owner_email",
                    "owner_whatsapp",
                    "owner_qualification",
                    "owner_photo",
                    "owner_photo_url",
                    "owner_profile_url",
                )
            },
        ),
    )


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "is_featured", "sort_order")
    list_filter = ("is_featured",)
    search_fields = ("name", "role", "content")


@admin.register(FreeLearningVideo)
class FreeLearningVideoAdmin(admin.ModelAdmin):
    list_display = ("title", "language", "is_published", "show_on_homepage", "sort_order", "updated_at")
    list_filter = ("language", "is_published", "show_on_homepage")
    search_fields = ("title", "description", "video_url")
    ordering = ("sort_order", "title")
