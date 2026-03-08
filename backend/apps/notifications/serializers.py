from rest_framework import serializers

from apps.notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "audience",
            "notification_type",
            "title",
            "message",
            "action_url",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["is_read", "created_at"]


class NotificationWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "user", "audience", "notification_type", "title", "message", "action_url"]
