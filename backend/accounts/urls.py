from django.urls import path
from . import views

urlpatterns = [
    path("admin/signup/", views.admin_signup),
]
