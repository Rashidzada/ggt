from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.quizzes.models import Quiz, QuizAttempt
from apps.quizzes.serializers import (
    QuizAttemptSerializer,
    QuizDetailSerializer,
    QuizListSerializer,
    QuizSubmissionSerializer,
    QuizWriteSerializer,
)
from common.permissions import IsAdminOrReadOnly, IsAdminRole


class QuizViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["course", "lesson", "is_published"]
    search_fields = ["title", "description", "course__title"]

    def get_queryset(self):
        queryset = Quiz.objects.select_related("course", "lesson").prefetch_related("questions__options")
        user = self.request.user
        if user.is_authenticated and user.role == user.Roles.ADMIN:
            return queryset
        return queryset.filter(is_published=True, course__is_published=True)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return QuizWriteSerializer
        if self.action == "retrieve":
            return QuizDetailSerializer
        return QuizListSerializer

    def _user_can_attempt(self, user, quiz):
        if not user.is_authenticated:
            return False
        if user.role == user.Roles.ADMIN:
            return True
        if quiz.lesson and quiz.lesson.is_free_preview and quiz.lesson.is_published:
            return True
        return quiz.course.has_access_for(user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def submit(self, request, slug=None):
        quiz = self.get_object()
        if not self._user_can_attempt(request.user, quiz):
            return Response({"detail": "You do not have access to this quiz."}, status=status.HTTP_403_FORBIDDEN)

        attempt_count = QuizAttempt.objects.filter(quiz=quiz, user=request.user).count()
        if attempt_count >= quiz.max_attempts:
            return Response({"detail": "Maximum attempts reached."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = QuizSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers = serializer.validated_data["answers"]

        total_questions = quiz.questions.count()
        correct_answers = 0
        for question in quiz.questions.all():
            selected_option_id = answers.get(str(question.id)) or answers.get(question.id)
            if question.options.filter(pk=selected_option_id, is_correct=True).exists():
                correct_answers += 1

        score = int((correct_answers / total_questions) * 100) if total_questions else 0
        attempt = QuizAttempt.objects.create(
            quiz=quiz,
            user=request.user,
            answers=answers,
            score=score,
            total_questions=total_questions,
            correct_answers=correct_answers,
            passed=score >= quiz.passing_score,
        )
        return Response(QuizAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class QuizAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["quiz", "passed"]

    def get_queryset(self):
        queryset = QuizAttempt.objects.select_related("quiz", "user")
        user = self.request.user
        if user.role == user.Roles.ADMIN:
            return queryset
        return queryset.filter(user=user)
