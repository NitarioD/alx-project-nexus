🐍 Backend API Service (Django REST Framework)

This folder contains the complete source code for the RESTful API that powers the ALX Project Nexus application.

⚙️ Technology Stack

Framework: Django 5.0

API: Django REST Framework (DRF)

Language: Python 3.10+

Database: PostgreSQL (with psycopg2-binary)

Data Filtering: django-filter

Cross-Origin: django-cors-headers

📊 Database Schema (Core Models)

The primary application, catalog/, manages the core e-commerce data structure:

Product: Stores details (name, description, price, stock, image URL).

Category: Simple grouping for products.

Review: User-submitted ratings and comments for products.

🚀 Setup and Installation (Docker Compose)

The easiest way to run the entire backend service (including the PostgreSQL database) is using Docker Compose.

Configuration: Create and configure the .env file in this directory (see the placeholder file).

Build & Run:

# From the project root directory
docker-compose build
docker-compose up


Database Seeding: Run the custom management command to populate the database with dummy data:

docker-compose exec backend python manage.py seed_data --items 100


Access: The API will be available at http://localhost:8000/.

📍 Key Endpoints

Endpoint

Method

Description

/api/products/

GET

List all products with filtering, searching, and pagination.

/api/products/{id}/

GET

Retrieve a specific product.

/api/categories/

GET

List all available product categories.

/api/products/{id}/reviews/

GET/POST

List and create reviews for a product.
