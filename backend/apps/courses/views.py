from django.db.models import Prefetch, Q
from django.http import FileResponse
from django.utils import timezone
from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.courses.models import (
    Course,
    CourseCategory,
    Enrollment,
    EnrollmentApplication,
    Lesson,
    LessonProgress,
    PaymentRecord,
    Resource,
)
from apps.courses.serializers import (
    CourseCategorySerializer,
    CourseDetailSerializer,
    CourseListSerializer,
    EnrollmentApplicationAdminSerializer,
    EnrollmentApplicationSerializer,
    EnrollmentSerializer,
    EnrollmentWriteSerializer,
    LessonProgressSerializer,
    PaymentRecordSerializer,
    PaymentRecordWriteSerializer,
)
from apps.courses.utils import build_invoice_pdf
from common.permissions import IsAdminOrReadOnly, IsAdminRole


class CourseCategoryViewSet(viewsets.ModelViewSet):
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"
    search_fields = ["title"]


class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["category__slug", "level", "course_type", "pricing_model", "featured"]
    search_fields = ["title", "short_description", "full_description", "instructor_name"]
    ordering_fields = ["created_at", "title"]

    def get_queryset(self):
        queryset = Course.objects.select_related("category").prefetch_related(
            Prefetch("lessons", queryset=Lesson.objects.order_by("order")),
            Prefetch("resources", queryset=Resource.objects.order_by("order")),
        )
        user = self.request.user
        if user.is_authenticated and user.role == user.Roles.ADMIN:
            return queryset
        return queryset.filter(is_published=True)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CourseDetailSerializer
        return CourseListSerializer

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def featured(self, request):
        queryset = self.filter_queryset(self.get_queryset().filter(featured=True)[:6])
        serializer = CourseListSerializer(queryset, many=True, context=self.get_serializer_context())
        return Response(serializer.data)


class EnrollmentApplicationViewSet(viewsets.ModelViewSet):
    filterset_fields = ["status", "course"]
    search_fields = ["name", "email", "phone", "course__title"]

    def get_queryset(self):
        queryset = EnrollmentApplication.objects.select_related("course", "user")
        user = self.request.user
        if user.is_authenticated and user.role == user.Roles.ADMIN:
            return queryset
        if user.is_authenticated:
            return queryset.filter(Q(user=user) | Q(email=user.email))
        return queryset.none()

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        user = self.request.user
        if user.is_authenticated and user.role == user.Roles.ADMIN:
            return EnrollmentApplicationAdminSerializer
        return EnrollmentApplicationSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    filterset_fields = ["status", "course"]
    search_fields = ["user__full_name", "user__email", "course__title"]

    def get_queryset(self):
        queryset = Enrollment.objects.select_related("user", "course", "application").prefetch_related("payments")
        user = self.request.user
        if user.role == user.Roles.ADMIN:
            return queryset
        return queryset.filter(user=user)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return EnrollmentWriteSerializer
        return EnrollmentSerializer


class PaymentRecordViewSet(viewsets.ModelViewSet):
    filterset_fields = ["status", "payment_method", "enrollment__course"]
    search_fields = ["invoice_number", "transaction_reference", "enrollment__user__email", "enrollment__course__title"]

    def get_queryset(self):
        queryset = PaymentRecord.objects.select_related("enrollment__course", "enrollment__user")
        user = self.request.user
        if user.role == user.Roles.ADMIN:
            return queryset
        return queryset.filter(enrollment__user=user)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PaymentRecordWriteSerializer
        return PaymentRecordSerializer

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def invoice(self, request, pk=None):
        payment = self.get_object()
        pdf_buffer = build_invoice_pdf(payment)
        return FileResponse(
            pdf_buffer,
            as_attachment=True,
            filename=f"{payment.invoice_number}.pdf",
            content_type="application/pdf",
        )


class LessonProgressViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LessonProgress.objects.filter(user=self.request.user).select_related("lesson__course")

    def perform_create(self, serializer):
        completed = serializer.validated_data.get("is_completed")
        if completed:
            serializer.validated_data["completed_at"] = timezone.now()
        serializer.save()

    def perform_update(self, serializer):
        completed = serializer.validated_data.get("is_completed")
        if completed and not serializer.instance.completed_at:
            serializer.validated_data["completed_at"] = timezone.now()
        serializer.save()
