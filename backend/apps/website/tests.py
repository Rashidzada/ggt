from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.website.models import FreeLearningVideo, HomepageContent


class HomepageApiTests(APITestCase):
    def setUp(self):
        HomepageContent.objects.create(
            hero_title="Learn practical skills",
            hero_subtitle="A lightweight learning platform.",
            intro_text="Intro",
            owner_photo_url="https://drive.google.com/file/d/1cYC77czDbSfBsNQJqUGvMvK4FCc2vO0p/view?usp=sharing",
        )
        self.student = User.objects.create_user(
            email="video-student@gogreentech.local",
            password="Student123!",
            full_name="Video Student",
            phone_number="03001234567",
        )
        FreeLearningVideo.objects.create(
            title="Featured Free Lesson",
            description="Featured free lesson",
            video_url="https://www.youtube.com/watch?v=q15rpL3Zj8k",
            thumbnail_url="https://i.ytimg.com/vi/q15rpL3Zj8k/hqdefault.jpg",
            show_on_homepage=True,
            sort_order=1,
        )
        FreeLearningVideo.objects.create(
            title="Hidden Draft Lesson",
            description="Hidden lesson",
            video_url="https://www.youtube.com/watch?v=7-LCAy6EuUs",
            thumbnail_url="https://i.ytimg.com/vi/7-LCAy6EuUs/hqdefault.jpg",
            is_published=False,
            sort_order=2,
        )

    def test_homepage_endpoint_returns_content(self):
        response = self.client.get("/api/website/homepage/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("about_title", response.data)
        self.assertIn("owner_photo", response.data)
        self.assertIn("owner_photo_display_url", response.data)
        self.assertIn("owner_photo_url", response.data)
        self.assertEqual(
            response.data["owner_photo_display_url"],
            "https://drive.google.com/thumbnail?id=1cYC77czDbSfBsNQJqUGvMvK4FCc2vO0p&sz=w1600",
        )

    def test_featured_free_video_endpoint_is_public(self):
        response = self.client.get("/api/website/free-videos/featured/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["video_id"], "q15rpL3Zj8k")
        self.assertTrue(response.data["show_on_homepage"])

    def test_free_video_library_requires_authentication(self):
        response = self.client.get("/api/website/free-videos/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_gets_only_published_free_videos(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get("/api/website/free-videos/")
        payload = response.data["results"] if isinstance(response.data, dict) else response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]["title"], "Featured Free Lesson")
