from rest_framework import status
from rest_framework.test import APITestCase

from apps.courses.models import Course, CourseCategory, Lesson


class CoursePreviewTests(APITestCase):
    def setUp(self):
        category = CourseCategory.objects.create(title="Programming")
        self.course = Course.objects.create(
            category=category,
            title="Python Basics",
            short_description="Learn Python",
            full_description="Course description",
            duration="6 weeks",
            course_type=Course.CourseTypes.PAID,
            pricing_model=Course.PricingModels.QUOTE,
            is_published=True,
        )
        Lesson.objects.create(
            course=self.course,
            title="Preview Lesson",
            video_url="https://example.com/preview",
            duration_minutes=10,
            order=1,
            is_free_preview=True,
            is_published=True,
        )
        Lesson.objects.create(
            course=self.course,
            title="Locked Lesson",
            video_url="https://example.com/locked",
            duration_minutes=10,
            order=2,
            is_free_preview=False,
            is_published=True,
        )

    def test_guest_only_sees_preview_lessons(self):
        response = self.client.get(f"/api/courses/{self.course.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["lessons"]), 1)


class ApplicationFlowTests(APITestCase):
    def setUp(self):
        category = CourseCategory.objects.create(title="Design")
        self.course = Course.objects.create(
            category=category,
            title="UI Design",
            short_description="Modern design systems",
            full_description="Course description",
            duration="4 weeks",
            course_type=Course.CourseTypes.PAID,
            pricing_model=Course.PricingModels.HYBRID,
            listed_price=5000,
            is_published=True,
        )

    def test_user_can_create_course_application(self):
        response = self.client.post(
            "/api/courses/applications/",
            {
                "course": self.course.id,
                "name": "Ali",
                "email": "ali@example.com",
                "phone": "03001230000",
                "message": "I want to join.",
                "preferred_contact_whatsapp": True,
                "agreed_via_whatsapp": True,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
