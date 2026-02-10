from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch

from .models import Category, Product, Review
from .serializers import CategorySerializer, ProductSerializer, ReviewSerializer
from .filters import ProductFilter

class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for product categories.
    Public can read; write operations require authentication.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [OrderingFilter]
    ordering_fields = ['title', 'created_at']

class ProductViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for listing, retrieving, creating, updating, and deleting products.
    Includes filtering, searching, and custom actions for reviews.
    """
    # Prefetch related reviews to avoid N+1 query problem, especially for detail view
    queryset = Product.objects.select_related('category').prefetch_related(
        Prefetch('reviews', queryset=Review.objects.all().order_by('-created_at'))
    )
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    # Search and ordering leverage DRF's built-in filters
    search_fields = ['name', 'description', 'category__title']
    ordering_fields = ['name', 'price', 'stock_quantity', 'created_at']

    # --- Custom Action for Reviews (Nested Route) ---

    @action(detail=True, methods=['get', 'post'])
    def reviews(self, request, pk=None):
        """
        Custom endpoint to list or create reviews for a specific product.
        GET: /api/products/{pk}/reviews/
        POST: /api/products/{pk}/reviews/
        """
        product = self.get_object()

        if request.method == 'GET':
            # List all reviews for the product, sorted by newest first (default in model)
            reviews = product.reviews.all()
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            # Create a new review for this product
            serializer = ReviewSerializer(data=request.data)
            if serializer.is_valid():
                # Associate the review with the product
                serializer.save(product=product)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Fallback for unexpected request methods
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
