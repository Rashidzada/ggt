from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.website.views import FreeLearningVideoViewSet, HomepageContentAPIView, TestimonialViewSet

router = DefaultRouter()
router.register("testimonials", TestimonialViewSet, basename="testimonial")
router.register("free-videos", FreeLearningVideoViewSet, basename="free-video")

urlpatterns = [
    path("homepage/", HomepageContentAPIView.as_view(), name="homepage-content"),
]
urlpatterns += router.urls
