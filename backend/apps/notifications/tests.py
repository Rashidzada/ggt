from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.notifications.models import Notification


class NotificationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="notify@example.com",
            full_name="Notify User",
            password="StrongPass123!",
        )
        Notification.objects.create(
            user=self.user,
            audience=Notification.Audiences.DIRECT,
            title="Direct notice",
            message="Hello",
        )

    def test_authenticated_user_sees_notifications(self):
        login = self.client.post("/api/auth/login/", {"email": self.user.email, "password": "StrongPass123!"}, format="json")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        response = self.client.get("/api/notifications/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
