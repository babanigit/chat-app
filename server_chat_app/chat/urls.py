# chat/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ChatRoomViewSet, MessageViewSet, hello_world

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'chatrooms', ChatRoomViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', hello_world, name='hello_world'),
    path('api/', include(router.urls)),
]