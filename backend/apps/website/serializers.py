from urllib.parse import parse_qs, urljoin, urlparse

from django.conf import settings
from rest_framework import serializers

from apps.website.models import FreeLearningVideo, HomepageContent, Testimonial


def extract_google_drive_file_id(raw_url: str) -> str:
    if not raw_url:
        return ""

    parsed = urlparse(raw_url)
    if "drive.google.com" not in parsed.netloc:
        return ""

    path_parts = [part for part in parsed.path.split("/") if part]
    if len(path_parts) >= 3 and path_parts[0] == "file" and path_parts[1] == "d":
        return path_parts[2]

    query_id = parse_qs(parsed.query).get("id", [""])[0]
    if query_id:
        return query_id

    return ""


def normalize_image_url(raw_url: str) -> str:
    if not raw_url:
        return ""

    drive_file_id = extract_google_drive_file_id(raw_url)
    if drive_file_id:
        return f"https://drive.google.com/thumbnail?id={drive_file_id}&sz=w1600"

    return raw_url


class HomepageContentSerializer(serializers.ModelSerializer):
    owner_photo_display_url = serializers.SerializerMethodField()

    def get_owner_photo_display_url(self, obj):
        if obj.owner_photo_url:
            return normalize_image_url(obj.owner_photo_url)

        if obj.owner_photo:
            request = self.context.get("request")
            if request is not None:
                return request.build_absolute_uri(obj.owner_photo.url)

            return urljoin(f"{settings.SITE_URL.rstrip('/')}/", obj.owner_photo.url.lstrip("/"))

        return ""

    class Meta:
        model = HomepageContent
        fields = [
            "id",
            "site_name",
            "tagline",
            "hero_title",
            "hero_subtitle",
            "intro_text",
            "about_title",
            "about_description",
            "intro_video_urls",
            "why_choose_us",
            "learning_modes",
            "owner_name",
            "owner_role",
            "owner_email",
            "owner_whatsapp",
            "owner_qualification",
            "owner_photo",
            "owner_photo_display_url",
            "owner_photo_url",
            "owner_profile_url",
            "footer_note",
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "name", "role", "content", "avatar_url", "is_featured", "sort_order"]


class FreeLearningVideoSerializer(serializers.ModelSerializer):
    video_id = serializers.CharField(read_only=True)
    embed_url = serializers.CharField(read_only=True)

    class Meta:
        model = FreeLearningVideo
        fields = [
            "id",
            "title",
            "description",
            "video_url",
            "video_id",
            "embed_url",
            "thumbnail_url",
            "language",
            "sort_order",
            "is_published",
            "show_on_homepage",
        ]
