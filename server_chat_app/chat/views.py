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


class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            # Print debug information
            print(f"Request data: {request.data}")
            print(f"User: {request.user}")

            # Create serializer
            serializer = self.get_serializer(data=request.data)

            # Validate
            if not serializer.is_valid():
                print(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Save chat room
            chat_room = serializer.save()

            # Add participant
            chat_room.participants.add(request.user)

            # Get updated serializer
            updated_serializer = self.get_serializer(chat_room)

            return Response(updated_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error creating chat room: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        print(f"Number of chatrooms found: {queryset.count()}")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        # Get rooms where user is participant
        user_rooms = ChatRoom.objects.filter(participants=self.request.user)
        print(f"Found {user_rooms.count()} rooms for user {self.request.user}")
        return user_rooms


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            # Check if user is participant of the chat room
            chat_room = ChatRoom.objects.get(id=self.request.data.get("room"))
            if self.request.user not in chat_room.participants.all():
                raise ValidationError("You are not a participant of this chat room")
            serializer.save(user=self.request.user)
        except ChatRoom.DoesNotExist:
            raise ValidationError("Chat room does not exist")
        except ValidationError as e:
            raise ValidationError(detail=str(e))

    def list(self, request, *args, **kwargs):
        room_id = request.query_params.get("room")
        if room_id:
            # Only show messages from rooms where user is a participant
            self.queryset = self.queryset.filter(
                room_id=room_id, room__participants=request.user
            )
        return super().list(request, *args, **kwargs)


def hello_world(request):
    return HttpResponse("API is running")
