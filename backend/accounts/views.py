"""
Admin authentication views: signup (create superuser) and JWT signin.
"""
import secrets
import string
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

User = get_user_model()


def _generate_random_password(length: int = 16) -> str:
    """Generate a secure random password."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def _generate_random_username(prefix: str = "admin") -> str:
    """Generate a unique username with random suffix."""
    suffix = secrets.token_hex(4)
    return f"{prefix}_{suffix}"


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_signup(request):
    """
    Create a new superuser with random credentials.
    Returns: { "username": "...", "password": "..." }
    Use these credentials to sign in via /api/auth/login/ to get JWT tokens.
    """
    # Generate random credentials
    username = _generate_random_username()
    password = _generate_random_password()

    # Ensure username is unique
    while User.objects.filter(username=username).exists():
        username = _generate_random_username()

    try:
        User.objects.create_superuser(
            username=username,
            email=f"{username}@admin.local",
            password=password,
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {
            "username": username,
            "password": password,
            "message": "Superuser created. Use these credentials to sign in at /api/auth/login/",
        },
        status=status.HTTP_201_CREATED,
    )
