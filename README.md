# ALX Project Nexus - E-Commerce Platform

A modern full-stack e-commerce platform built with React (Vite) frontend and Django REST API backend, featuring product catalog, user authentication, and shopping cart functionality.

## 🚀 Features

- **Product Catalog**: Browse products with categories, search, and filtering
- **User Authentication**: JWT-based login and registration
- **Shopping Cart**: Add/remove products, quantity management
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **API Documentation**: Interactive Swagger documentation
- **Admin Dashboard**: Product and category management

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend

- **Django 5.0** with Django REST Framework
- **PostgreSQL** database
- **JWT Authentication** with Simple JWT
- **Django Filters** for API filtering
- **CORS** support for frontend integration

### DevOps

- **Docker** for containerization
- **Gunicorn** for production serving
- **Environment-based configuration**

## 📁 Project Structure

alx-project-nexus/
├── frontend/ # React application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── features/ # Redux slices and API logic
│ │ ├── pages/ # Page components
│ │ └── types/ # TypeScript type definitions
│ ├── package.json
│ └── vite.config.ts
├── backend/ # Django application
│ ├── catalog/ # Main app with models and views
│ ├── backend/ # Django project settings
│ ├── manage.py
│ ├── requirements.txt
│ └── settings.py
└── README.md

## 🏃‍♂️ Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, can use SQLite for development)

### Backend Setup

1. Navigate to backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Create virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate # On Windows: venv\Scripts\activate
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. Create environment file:
   \`\`\`bash

   # Create .env file with:

   DEBUG=True
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=127.0.0.1,localhost
   \`\`\`

5. Run migrations:
   \`\`\`bash
   python manage.py migrate
   \`\`\`

6. (Optional) Seed database:
   \`\`\`bash
   python manage.py seed_data
   \`\`\`

7. Start development server:
   \`\`\`bash
   python manage.py runserver
   \`\`\`

### Frontend Setup

1. Navigate to frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file (optional):
   \`\`\`bash

   # Create .env file with:

   VITE_API_BASE_URL=http://localhost:8000/api
   \`\`\`

4. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 📚 API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/docs/redoc/

### Main Endpoints

- `GET /api/products/` - List products with filtering
- `GET /api/products/{id}/` - Product details
- `GET /api/categories/` - List categories
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/refresh/` - Refresh JWT token

## 🔧 Development

### Running Tests

\`\`\`bash

# Backend tests

cd backend && python manage.py test

# Frontend build check

cd frontend && npm run build
\`\`\`

### Code Quality

- **Backend**: Follow Django best practices, use type hints
- **Frontend**: ESLint and TypeScript for code quality
- **Git**: Feature branches, descriptive commits

## 🚀 Deployment

### Backend

\`\`\`bash

# Production settings

DEBUG=False
SECRET_KEY=your-production-secret
ALLOWED_HOSTS=your-domain.com
\`\`\`

### Frontend

\`\`\`bash
npm run build

# Serve dist/ folder with any static server

\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
