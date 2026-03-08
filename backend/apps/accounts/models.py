from django.conf import settings
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models

from common.models import TimeStampedModel


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Email is required.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.full_clean()
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", User.Roles.STUDENT)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("role", User.Roles.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra_fields)


class User(TimeStampedModel, AbstractBaseUser, PermissionsMixin):
    class Roles(models.TextChoices):
        ADMIN = "admin", "Admin"
        STUDENT = "student", "Student"

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.STUDENT)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    objects = UserManager()

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["role"]),
        ]

    def save(self, *args, **kwargs):
        if self.role == self.Roles.ADMIN:
            queryset = User.objects.filter(role=self.Roles.ADMIN)
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            if queryset.exists():
                raise ValidationError("Only one admin account is supported in this MVP.")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email


class StudentProfile(TimeStampedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    profile_photo = models.ImageField(upload_to="profiles/", blank=True, null=True)
    city = models.CharField(max_length=120, blank=True)
    qualification = models.CharField(max_length=160, blank=True)
    bio = models.TextField(blank=True)

    class Meta:
        ordering = ["user__full_name"]

    def __str__(self):
        return f"{self.user.full_name} profile"
