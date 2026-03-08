from django.db.models import Count
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.serializers import UserSerializer
from apps.accounts.models import User
from apps.courses.models import Course, Enrollment, EnrollmentApplication, PaymentRecord
from apps.courses.serializers import EnrollmentSerializer, PaymentRecordSerializer
from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer
from apps.quizzes.models import QuizAttempt
from apps.quizzes.serializers import QuizAttemptSerializer


class AdminStatsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != request.user.Roles.ADMIN:
            return Response({"detail": "Forbidden"}, status=403)

        data = {
            "total_students": User.objects.filter(role=User.Roles.STUDENT).count(),
            "total_enrollments": Enrollment.objects.count(),
            "total_active_courses": Course.objects.filter(is_published=True).count(),
            "total_applications": EnrollmentApplication.objects.count(),
            "recent_signups": UserSerializer(User.objects.filter(role=User.Roles.STUDENT)[:5], many=True).data,
            "quiz_activity": QuizAttemptSerializer(QuizAttempt.objects.select_related("quiz", "user")[:5], many=True).data,
            "recent_applications": [
                {
                    "id": application.id,
                    "name": application.name,
                    "course": application.course.title,
                    "status": application.status,
                    "created_at": application.created_at,
                }
                for application in EnrollmentApplication.objects.select_related("course")[:5]
            ],
            "course_statistics": list(
                Course.objects.annotate(enrollment_count=Count("enrollments")).values(
                    "title",
                    "course_type",
                    "enrollment_count",
                    "featured",
                )
            ),
        }
        return Response(data)


class StudentDashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        notification_queryset = Notification.objects.filter(user=user) | Notification.objects.filter(
            user__isnull=True,
            audience__in=[Notification.Audiences.ALL, Notification.Audiences.STUDENTS],
        )
        data = {
            "profile": UserSerializer(user).data,
            "enrollments": EnrollmentSerializer(
                Enrollment.objects.filter(user=user).select_related("course"),
                many=True,
                context={"request": request},
            ).data,
            "quiz_attempts": QuizAttemptSerializer(
                QuizAttempt.objects.filter(user=user).select_related("quiz")[:5],
                many=True,
            ).data,
            "notifications": NotificationSerializer(
                notification_queryset.order_by("-created_at")[:5],
                many=True,
            ).data,
            "payments": PaymentRecordSerializer(
                PaymentRecord.objects.filter(enrollment__user=user).select_related("enrollment__course")[:5],
                many=True,
                context={"request": request},
            ).data,
            "unread_notifications": notification_queryset.filter(is_read=False).count(),
        }
        return Response(data)
