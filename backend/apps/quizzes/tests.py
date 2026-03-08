from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.courses.models import Course, CourseCategory
from apps.quizzes.models import Option, Question, Quiz


class QuizAttemptTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="quiz@example.com",
            full_name="Quiz Student",
            password="StrongPass123!",
        )
        category = CourseCategory.objects.create(title="Data")
        course = Course.objects.create(
            category=category,
            title="Data Basics",
            short_description="Data course",
            full_description="Course description",
            duration="4 weeks",
            course_type=Course.CourseTypes.FREE,
            pricing_model=Course.PricingModels.FIXED,
            listed_price=0,
            is_published=True,
        )
        self.quiz = Quiz.objects.create(course=course, title="Intro Quiz", is_published=True)
        self.question = Question.objects.create(quiz=self.quiz, prompt="What powers the backend?", order=1)
        self.correct_option = Option.objects.create(question=self.question, text="Django", is_correct=True, order=1)
        Option.objects.create(question=self.question, text="PHP", is_correct=False, order=2)

    def test_student_can_submit_quiz(self):
        response = self.client.post("/api/auth/login/", {"email": self.user.email, "password": "StrongPass123!"}, format="json")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        attempt = self.client.post(
            f"/api/quizzes/{self.quiz.slug}/submit/",
            {"answers": {str(self.question.id): self.correct_option.id}},
            format="json",
        )

        self.assertEqual(attempt.status_code, status.HTTP_201_CREATED)
        self.assertEqual(attempt.data["score"], 100)
