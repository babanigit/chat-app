# chat/views.py
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import ChatRoom, Message
from .serializers import UserSerializer, ChatRoomSerializer, MessageSerializer
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from django.db.utils import IntegrityError


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=["post"])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response(
                {"error": "Both username and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"error": "A user with that username already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# chat/views.py
class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["GET"])
    def available_rooms(self, request):
        """List all rooms user can potentially join"""
        all_rooms = ChatRoom.objects.all()
        serializer = self.get_serializer(all_rooms, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["POST"])
    def join_room(self, request, pk=None):
        """Allow users to join a room"""
        chatroom = self.get_object()

        # Check if already participant
        if request.user in chatroom.participants.all():
            return Response(
                {"message": "Already a participant"}, status=status.HTTP_200_OK
            )

        # Add user to room
        chatroom.participants.add(request.user)
        return Response(
            {"message": "Successfully joined room"}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["POST"])
    def leave_room(self, request, pk=None):
        """Allow users to leave a room"""
        chatroom = self.get_object()

        if request.user not in chatroom.participants.all():
            return Response(
                {"error": "Not a participant"}, status=status.HTTP_400_BAD_REQUEST
            )

        chatroom.participants.remove(request.user)
        return Response(
            {"message": "Successfully left room"}, status=status.HTTP_200_OK
        )


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        chat_room = ChatRoom.objects.get(id=self.request.data.get("room"))

        # Auto-join room if not participant
        if self.request.user not in chat_room.participants.all():
            chat_room.participants.add(self.request.user)

        serializer.save(user=self.request.user)


def hello_world(request):
    return HttpResponse("API is running")
