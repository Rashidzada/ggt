from urllib.parse import parse_qs, urlparse

from django.db import models

from common.models import TimeStampedModel


def extract_youtube_video_id(url: str) -> str:
    parsed = urlparse(url)
    query_video_id = parse_qs(parsed.query).get("v", [""])[0]
    if query_video_id:
        return query_video_id

    path_parts = [part for part in parsed.path.split("/") if part]
    if parsed.netloc.endswith("youtu.be") and path_parts:
        return path_parts[0]

    if len(path_parts) >= 2 and path_parts[0] in {"embed", "shorts", "live"}:
        return path_parts[1]

    return ""


class HomepageContent(TimeStampedModel):
    site_name = models.CharField(max_length=160, unique=True, default="GoGreenTech Learning Academy")
    tagline = models.CharField(max_length=180, blank=True)
    hero_title = models.CharField(max_length=200)
    hero_subtitle = models.TextField()
    intro_text = models.TextField()
    about_title = models.CharField(max_length=220, default="A practical learning platform built around guided progress")
    about_description = models.TextField(
        default=(
            "GoGreenTech Learning Academy is designed for students who want real skill development without a "
            "heavy or confusing learning system. The owner, Rashid Zada, combines software engineering experience "
            "with a simple teaching model: structured content, preview access, clear enrollment, and direct support."
        )
    )
    intro_video_urls = models.JSONField(default=list, blank=True)
    why_choose_us = models.JSONField(default=list, blank=True)
    learning_modes = models.JSONField(default=list, blank=True)
    owner_name = models.CharField(max_length=120, default="Rashid Zada")
    owner_role = models.CharField(max_length=120, default="Software Engineer")
    owner_email = models.EmailField(default="rashidzad6@gmail.com")
    owner_whatsapp = models.CharField(max_length=20, default="03470983567")
    owner_qualification = models.CharField(max_length=180, blank=True)
    owner_photo = models.ImageField(upload_to="website/owners/", blank=True, null=True)
    owner_photo_url = models.URLField(blank=True)
    owner_profile_url = models.URLField(blank=True, default="https://rashidzada.pythonanywhere.com/")
    footer_note = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name_plural = "Homepage content"

    def __str__(self):
        return self.site_name


class Testimonial(TimeStampedModel):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    content = models.TextField()
    avatar_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class FreeLearningVideo(TimeStampedModel):
    title = models.CharField(max_length=220)
    description = models.TextField(blank=True)
    video_url = models.URLField(unique=True)
    thumbnail_url = models.URLField(blank=True)
    language = models.CharField(max_length=60, default="Pashto")
    sort_order = models.PositiveIntegerField(default=1)
    is_published = models.BooleanField(default=True)
    show_on_homepage = models.BooleanField(default=False)

    class Meta:
        ordering = ["sort_order", "title"]

    @property
    def video_id(self) -> str:
        return extract_youtube_video_id(self.video_url)

    @property
    def embed_url(self) -> str:
        if not self.video_id:
            return ""
        return f"https://www.youtube-nocookie.com/embed/{self.video_id}?rel=0"

    def __str__(self):
        return self.title
