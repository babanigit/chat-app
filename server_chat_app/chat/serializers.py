# chat/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatRoom, Message


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    participant_ids = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True, source="participants"
    )

    class Meta:
        model = ChatRoom
        fields = ["id", "name", "participants", "participant_ids", "created_at"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add debug information
        representation["debug_info"] = {
            "participant_count": instance.participants.count(),
            "has_name": bool(instance.name),
        }
        return representation


class MessageSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "room", "user", "user_username", "content", "created_at"]
        read_only_fields = ["user"]
