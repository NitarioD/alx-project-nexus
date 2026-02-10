from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    """
    Model representing a product category (e.g., Electronics, Books, Clothing).
    """
    title = models.CharField(max_length=255, unique=True, help_text="The name of the category.")
    slug = models.SlugField(max_length=255, unique=True, help_text="SEO-friendly URL component.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']
        verbose_name_plural = "Categories"
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['title']),
        ]

    def __str__(self):
        return self.title

class Product(models.Model):
    """
    Model representing a single product in the catalog.
    """
    name = models.CharField(max_length=255, help_text="The full name of the product.")
    description = models.TextField(help_text="Detailed description of the product.")
    
    # Financial fields
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0.01)],
        help_text="Retail price of the product."
    )
    stock_quantity = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text="Current available stock."
    )
    
    # Relationships
    category = models.ForeignKey(
        Category, 
        on_delete=models.PROTECT, # Prevent category deletion if products exist
        related_name='products',
        help_text="The primary category this product belongs to."
    )
    
    # Metadata
    image_url = models.URLField(
        max_length=2000, 
        blank=True, 
        null=True, 
        help_text="URL for the primary product image."
    )
    is_available = models.BooleanField(default=True, help_text="Whether the product is currently purchasable.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['is_available']),
            models.Index(fields=['price']),
            models.Index(fields=['created_at']),
            models.Index(fields=['category', 'price']),
        ]

    def __str__(self):
        return self.name
    
    @property
    def average_rating(self):
        """Calculates the average rating from all associated reviews."""
        if not hasattr(self, '_average_rating'):
            # This is optimized to work with prefetch_related for reviews in views
            reviews = self.reviews.all()
            if reviews:
                self._average_rating = sum(r.rating for r in reviews) / len(reviews)
            else:
                self._average_rating = 0
        return self._average_rating


class Review(models.Model):
    """
    Model for user reviews and ratings on a product.
    """
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, # If product is deleted, reviews are deleted
        related_name='reviews',
        help_text="The product being reviewed."
    )
    name = models.CharField(max_length=255, help_text="Name of the user submitting the review.")
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating given to the product (1 to 5 stars)."
    )
    comment = models.TextField(blank=True, help_text="The text of the review.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        # Ensures a user (identified by name) can only leave one review per product
        # NOTE: In a real app, this would be based on an authenticated user ID.
        unique_together = ('product', 'name',) 

    def __str__(self):
        return f'Review by {self.name} for {self.product.name}'
