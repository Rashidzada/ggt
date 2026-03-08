from rest_framework.routers import DefaultRouter

from apps.courses.views import (
    CourseCategoryViewSet,
    CourseViewSet,
    EnrollmentApplicationViewSet,
    EnrollmentViewSet,
    LessonProgressViewSet,
    PaymentRecordViewSet,
)

router = DefaultRouter()
router.register("categories", CourseCategoryViewSet, basename="course-category")
router.register("applications", EnrollmentApplicationViewSet, basename="course-application")
router.register("enrollments", EnrollmentViewSet, basename="course-enrollment")
router.register("payments", PaymentRecordViewSet, basename="payment")
router.register("progress", LessonProgressViewSet, basename="lesson-progress")
router.register("", CourseViewSet, basename="course")

urlpatterns = router.urls
