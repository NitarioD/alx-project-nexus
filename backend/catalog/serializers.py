from rest_framework import serializers
from .models import Category, Product, Review


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.
    Used for listing and creating categories.
    """
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug', 'created_at']
        read_only_fields = ['created_at']


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for the Review model.
    """
    class Meta:
        model = Review
        fields = ['id', 'product', 'name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'product', 'created_at']
        
    def validate_rating(self, value):
        """Check that the rating is between 1 and 5."""
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class ProductSerializer(serializers.ModelSerializer):
    """
    Main serializer for the Product model.
    Includes the category title and the average rating property.
    """
    # Use the string representation of the ForeignKey
    category_title = serializers.CharField(source='category.title', read_only=True)
    
    # Read-only field from the Product model's @property method
    average_rating = serializers.SerializerMethodField()
    
    # Nested serializer to include a few recent reviews (useful for product detail page)
    # Using a nested field is common for detail views.
    reviews = ReviewSerializer(many=True, read_only=True)


    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock_quantity',
            'image_url', 'is_available', 'created_at', 'updated_at',
            'category', 'category_title', 'average_rating', 'reviews'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_average_rating(self, obj):
        """
        Custom method to retrieve the average rating, rounded to two decimal places.
        This leverages the model's optimized property.
        """
        return round(obj.average_rating, 2)
