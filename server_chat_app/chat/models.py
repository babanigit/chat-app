# chat/models.py
from django.db import models
from django.contrib.auth.models import User


class ChatRoom(models.Model):
    name = models.CharField(max_length=100)
    participants = models.ManyToManyField(User, related_name="chat_rooms")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name="messages",
        null=True,  # Making this nullable temporarily
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.user.username}: {self.content[:50]}"
