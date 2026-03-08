from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User


class DashboardAccessTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="dashboard@example.com",
            full_name="Dashboard User",
            password="StrongPass123!",
        )

    def test_student_dashboard_requires_auth(self):
        response = self.client.get("/api/dashboard/student/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
