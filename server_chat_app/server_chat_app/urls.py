from django.contrib import admin
from django.urls import path, include
from chat.views import hello_world

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("chat.urls")),
    path("", hello_world, name="hello-world"),
]
