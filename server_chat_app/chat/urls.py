from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ChatRoomViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'chatrooms', ChatRoomViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', UserViewSet.as_view({'post': 'login'}), name='user-login'),
]