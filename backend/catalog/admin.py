from django.contrib import admin
from .models import Category, Product, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Category model.
    """
    list_display = ['title', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Product model.
    Includes filtering and searching for easier management.
    """
    list_display = ['name', 'category', 'price', 'stock_quantity', 'is_available', 'created_at']
    list_filter = ['is_available', 'category']
    search_fields = ['name', 'description']
    list_editable = ['price', 'stock_quantity', 'is_available']
    list_per_page = 20

    # Ensure related objects are fetched efficiently when viewing the list
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Review model.
    """
    list_display = ['name', 'product', 'rating', 'created_at']
    list_filter = ['rating', 'product__category']
    search_fields = ['comment', 'name']
    list_per_page = 20
    # Ensure related product data is fetched efficiently
    raw_id_fields = ('product',)
