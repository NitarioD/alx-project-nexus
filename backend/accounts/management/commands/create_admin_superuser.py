"""
Management command to create a random superuser and print credentials.
Usage: python manage.py create_admin_superuser
"""
import secrets
import string
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


def _generate_random_password(length: int = 16) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def _generate_random_username(prefix: str = "admin") -> str:
    return f"{prefix}_{secrets.token_hex(4)}"


class Command(BaseCommand):
    help = "Create a superuser with random credentials and print them"

    def handle(self, *args, **options):
        username = _generate_random_username()
        while User.objects.filter(username=username).exists():
            username = _generate_random_username()

        password = _generate_random_password()

        User.objects.create_superuser(
            username=username,
            email=f"{username}@admin.local",
            password=password,
        )

        self.stdout.write(self.style.SUCCESS("\nSuperuser created successfully!\n"))
        self.stdout.write("=" * 50)
        self.stdout.write(f"Username: {username}")
        self.stdout.write(f"Password: {password}")
        self.stdout.write("=" * 50)
        self.stdout.write("\nSign in at POST /api/auth/login/ with these credentials to get JWT tokens.\n")
