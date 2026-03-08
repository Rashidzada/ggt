from django.conf import settings
from django.db import models

from common.models import TimeStampedModel


class Notification(TimeStampedModel):
    class Audiences(models.TextChoices):
        ALL = "all", "All"
        STUDENTS = "students", "Students"
        ADMIN = "admin", "Admin"
        DIRECT = "direct", "Direct"

    class Types(models.TextChoices):
        ENROLLMENT = "enrollment", "Enrollment"
        QUIZ = "quiz", "Quiz"
        RESOURCE = "resource", "Resource"
        COURSE = "course", "Course Update"
        ANNOUNCEMENT = "announcement", "Announcement"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
        blank=True,
        null=True,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="sent_notifications",
        blank=True,
        null=True,
    )
    audience = models.CharField(max_length=20, choices=Audiences.choices, default=Audiences.DIRECT)
    notification_type = models.CharField(max_length=20, choices=Types.choices, default=Types.ANNOUNCEMENT)
    title = models.CharField(max_length=160)
    message = models.TextField()
    action_url = models.URLField(blank=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
