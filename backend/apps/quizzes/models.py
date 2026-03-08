from django.conf import settings
from django.db import models

from common.models import TimeStampedModel
from common.utils import generate_unique_slug


class Quiz(TimeStampedModel):
    course = models.ForeignKey("courses.Course", on_delete=models.CASCADE, related_name="quizzes")
    lesson = models.ForeignKey(
        "courses.Lesson",
        on_delete=models.SET_NULL,
        related_name="quizzes",
        blank=True,
        null=True,
    )
    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    passing_score = models.PositiveSmallIntegerField(default=60)
    max_attempts = models.PositiveSmallIntegerField(default=10)
    is_published = models.BooleanField(default=False)
    shuffle_options = models.BooleanField(default=False)

    class Meta:
        ordering = ["title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Quiz, self.title, self.pk)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Question(TimeStampedModel):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    prompt = models.TextField()
    explanation = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.prompt[:60]


class Option(TimeStampedModel):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.text[:60]


class QuizAttempt(TimeStampedModel):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="attempts")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quiz_attempts")
    answers = models.JSONField(default=dict)
    score = models.PositiveSmallIntegerField(default=0)
    total_questions = models.PositiveSmallIntegerField(default=0)
    correct_answers = models.PositiveSmallIntegerField(default=0)
    passed = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.quiz.title}"
