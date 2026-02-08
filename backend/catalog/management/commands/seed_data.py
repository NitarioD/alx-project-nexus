import random
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from catalog.models import Category, Product, Review

# --- External Library Mocking (using standard python library instead of Faker) ---
# In a real project, we would use the 'Faker' library, but to keep the requirements simple,
# we'll use simple lists for realistic-looking data.

PRODUCT_NAMES = [
    "Wireless Mechanical Keyboard", "1TB NVMe SSD", "Noise Cancelling Headphones",
    "4K Curved Monitor", "Ergonomic Office Chair", "Smart Home Hub",
    "High-Speed Blender", "Stainless Steel Water Bottle", "Portable Power Bank",
    "Digital Drawing Tablet", "Professional DSLR Camera", "Hiking Backpack 50L",
    "Organic Cotton T-Shirt", "Minimalist Leather Wallet", "Bluetooth Speaker"
]
CATEGORIES = {
    "Electronics": ["Tech", "Gadgets", "Audio", "Smart"],
    "Home & Kitchen": ["Appliances", "Cookware", "Decor"],
    "Fashion": ["Apparel", "Accessories", "Footwear"],
    "Outdoors": ["Camping", "Hiking", "Travel"],
}

def generate_description(name):
    """Generates a semi-realistic product description."""
    return f"Experience the ultimate performance with the new {name}. Featuring cutting-edge technology and a sleek, durable design, it's perfect for both professional use and everyday tasks. Get yours today!"

# --- Command Implementation ---

class Command(BaseCommand):
    help = 'Seeds the database with initial categories, products, and reviews.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--items',
            type=int,
            default=50,
            help='Number of products to create in total.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("--- Starting Database Seeding ---")

        total_items = options['items']

        # 1. Clear Existing Data (Optional but useful for development)
        self.stdout.write("Cleaning up existing data...")
        Review.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        
        # 2. Create Categories
        self.stdout.write("Creating categories...")
        category_objects = []
        for title in CATEGORIES.keys():
            category_objects.append(
                Category(title=title, slug=slugify(title))
            )
        
        Category.objects.bulk_create(category_objects)
        categories = list(Category.objects.all())

        self.stdout.write(self.style.SUCCESS(f"Created {len(categories)} categories."))

        # 3. Create Products
        self.stdout.write(f"Creating {total_items} products...")
        product_objects = []
        for i in range(total_items):
            name = random.choice(PRODUCT_NAMES) + f" #{i + 1}"
            
            # Select category and generate price/stock
            category = random.choice(categories)
            price = round(random.uniform(9.99, 999.99), 2)
            stock = random.randint(0, 500)
            
            # Simple placeholder image URL
            image_url = f"https://placehold.co/400x300/{random.choice(['000', '333', '666'])}/white?text={name.replace(' ', '+')}"

            product_objects.append(
                Product(
                    name=name,
                    description=generate_description(name),
                    price=price,
                    stock_quantity=stock,
                    category=category,
                    image_url=image_url,
                    is_available=stock > 0
                )
            )

        Product.objects.bulk_create(product_objects)
        products = list(Product.objects.all())
        self.stdout.write(self.style.SUCCESS(f"Created {len(products)} products."))


        # 4. Create Reviews
        self.stdout.write("Creating reviews...")
        review_objects = []
        for product in products:
            num_reviews = random.randint(0, 5)
            for j in range(num_reviews):
                rating = random.randint(1, 5)
                name = f"User{j + 1}_{product.id}"
                comment = ""
                
                if rating >= 4:
                    comment = "Excellent product, highly recommend!"
                elif rating == 3:
                    comment = "It's decent, met expectations."
                else:
                    comment = "Needs improvement, especially in features."

                review_objects.append(
                    Review(
                        product=product,
                        name=name,
                        rating=rating,
                        comment=comment,
                    )
                )

        Review.objects.bulk_create(review_objects)
        self.stdout.write(self.style.SUCCESS(f"Created {len(review_objects)} reviews."))

        self.stdout.write("--- Database Seeding Complete! ---")
