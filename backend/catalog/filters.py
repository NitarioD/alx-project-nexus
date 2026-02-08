import django_filters
from .models import Product, Category

class ProductFilter(django_filters.FilterSet):
    """
    Custom filterset for the Product model to allow filtering on various fields.
    This enhances the functionality of the ProductList view.
    """
    # Filter by price range
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')

    # Filter by category slug (used by the frontend for clean URLs)
    category_slug = django_filters.CharFilter(
        field_name='category__slug', 
        lookup_expr='exact',
        help_text="Filter products by category slug."
    )
    
    # Filter by name or description (optional full text search setup)
    search_term = django_filters.CharFilter(
        field_name='name', 
        lookup_expr='icontains',
        help_text="Filter products whose name contains the search term (case-insensitive)."
    )
    
    # Filter by availability
    is_available = django_filters.BooleanFilter(
        field_name='is_available',
        help_text="Filter products by availability (True/False)."
    )

    class Meta:
        model = Product
        fields = ['category_slug', 'is_available', 'min_price', 'max_price', 'search_term']
