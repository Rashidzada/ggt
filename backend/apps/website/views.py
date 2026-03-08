from rest_framework import permissions, response, viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView

from apps.website.models import FreeLearningVideo, HomepageContent, Testimonial
from apps.website.serializers import FreeLearningVideoSerializer, HomepageContentSerializer, TestimonialSerializer
from common.permissions import IsAdminOrReadOnly, IsAdminRole


class HomepageContentAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return HomepageContent.objects.order_by("created_at").first()

    def get(self, request):
        content = self.get_object()
        if content is None:
            content = HomepageContent.objects.create(
                hero_title="GoGreenTech Learning Academy",
                hero_subtitle="Practical courses with guided support.",
                intro_text="A lightweight learning platform for guided technical education.",
            )
        serializer = HomepageContentSerializer(content, context={"request": request})
        return response.Response(serializer.data)

    def put(self, request):
        if not request.user.is_authenticated or request.user.role != request.user.Roles.ADMIN:
            return response.Response({"detail": "Authentication credentials were not provided."}, status=403)
        content = self.get_object()
        if content is None:
            content = HomepageContent.objects.create(
                hero_title="GoGreenTech Learning Academy",
                hero_subtitle="Practical courses with guided support.",
                intro_text="A lightweight learning platform for guided technical education.",
            )
        serializer = HomepageContentSerializer(content, data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(serializer.data)

    def patch(self, request):
        if not request.user.is_authenticated or request.user.role != request.user.Roles.ADMIN:
            return response.Response({"detail": "Authentication credentials were not provided."}, status=403)
        content = self.get_object()
        if content is None:
            content = HomepageContent.objects.create(
                hero_title="GoGreenTech Learning Academy",
                hero_subtitle="Practical courses with guided support.",
                intro_text="A lightweight learning platform for guided technical education.",
            )
        serializer = HomepageContentSerializer(content, data=request.data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(serializer.data)


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]


class FreeLearningVideoViewSet(viewsets.ModelViewSet):
    serializer_class = FreeLearningVideoSerializer
    queryset = FreeLearningVideo.objects.all()
    filterset_fields = ["is_published", "show_on_homepage", "language"]
    search_fields = ["title", "description", "language"]
    ordering_fields = ["sort_order", "title", "created_at", "updated_at"]
    ordering = ["sort_order", "title"]

    def get_queryset(self):
        queryset = FreeLearningVideo.objects.all()
        user = self.request.user
        if user.is_authenticated and user.role == user.Roles.ADMIN:
            return queryset
        return queryset.filter(is_published=True)

    def get_permissions(self):
        if self.action == "featured":
            return [permissions.AllowAny()]
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [IsAdminRole()]

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def featured(self, request):
        queryset = self.get_queryset().filter(is_published=True)
        video = queryset.filter(show_on_homepage=True).first() or queryset.first()
        if video is None:
            return response.Response(None)
        serializer = self.get_serializer(video)
        return response.Response(serializer.data)
