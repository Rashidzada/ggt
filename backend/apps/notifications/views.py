from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer, NotificationWriteSerializer
from common.permissions import IsAdminRole


class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["notification_type", "is_read"]
    search_fields = ["title", "message"]

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.select_related("user", "created_by")
        if user.role == user.Roles.ADMIN:
            return queryset
        return queryset.filter(
            Q(user=user)
            | Q(audience=Notification.Audiences.ALL)
            | Q(audience=Notification.Audiences.STUDENTS)
        )

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return NotificationWriteSerializer
        return NotificationSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        audience = serializer.validated_data.get("audience", Notification.Audiences.DIRECT)
        if audience != Notification.Audiences.DIRECT:
            serializer.validated_data["user"] = None
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        if notification.user is None and request.user.role != request.user.Roles.ADMIN:
            return Response({"detail": "Broadcast notifications are read-only."}, status=400)
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response(NotificationSerializer(notification).data)
