from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User


class AuthFlowTests(APITestCase):
    def test_user_can_register(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "full_name": "Student User",
                "email": "student@example.com",
                "phone_number": "03001234567",
                "password": "StrongPass123!",
                "confirm_password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="student@example.com").exists())
