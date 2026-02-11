from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(title="E-Commerce API", default_version='v1'),
    public=True,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('catalog.urls')),
    path('api/auth/', include('auth.urls')),
    path('api/auth/login/', TokenObtainPairView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger'),
    path('api/docs/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc'),
]