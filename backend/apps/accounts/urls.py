from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.accounts.views import LoginAPIView, LogoutAPIView, PasswordChangeAPIView, ProfileAPIView, RegisterAPIView


urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="auth-register"),
    path("login/", LoginAPIView.as_view(), name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("logout/", LogoutAPIView.as_view(), name="auth-logout"),
    path("me/", ProfileAPIView.as_view(), name="auth-me"),
    path("password/", PasswordChangeAPIView.as_view(), name="auth-password-change"),
]
