from django.apps import AppConfig


class CatalogConfig(AppConfig):
    # Required for BigAutoField in Django 5.0+
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'catalog'
    verbose_name = 'E-commerce Product Catalog'
