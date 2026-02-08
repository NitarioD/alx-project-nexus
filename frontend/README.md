⚛️ Frontend Application Service (React + TypeScript)

This folder contains the complete source code for the responsive, modern web application that consumes the Django API.

⚙️ Technology Stack

Framework: React 18+

Language: TypeScript

Build Tool: Vite

State Management: Redux Toolkit (RTK)

Data Fetching: RTK Query (for caching and simplified API interactions)

Styling: Tailwind CSS (Utility-first framework)

📁 Architecture Highlights

RTK Query (src/app/api/api.ts): Used as the single source of truth for all server-side interactions, providing automatic caching and request lifecycle management.

Redux Toolkit (src/app/store.ts): Manages global application state (like the current filter sidebar state, loading states, etc.).

Feature Slices (src/features/): Codebase is organized by feature (e.g., products/).

🚀 Setup and Installation

Navigate to the frontend directory:

cd frontend/


Install dependencies:

npm install
# or yarn install / pnpm install


Run the development server:

npm run dev


Access: The application will typically be available at http://localhost:5173/. Ensure the backend API is also running (usually on port 8000).

💡 Environment Variables

The application needs to know where the API is hosted. This is handled via a .env.local file (ignored by git, as defined in the global .gitignore).

Create a file named .env.local in this directory:

VITE_API_BASE_URL="http://localhost:8000/api"
