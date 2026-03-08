from rest_framework.routers import DefaultRouter

from apps.quizzes.views import QuizAttemptViewSet, QuizViewSet

router = DefaultRouter()
router.register("attempts", QuizAttemptViewSet, basename="quiz-attempt")
router.register("", QuizViewSet, basename="quiz")

urlpatterns = router.urls
