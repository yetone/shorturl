# Short URL Service

A URL shortening service with analytics dashboard. Create short, memorable links that redirect to your long URLs. Track clicks and analyze performance with detailed analytics.

[English](README.md) | [简体中文](README.zh-CN.md)

## Features

- **URL Shortening**: Transform long links into short, memorable URLs
- **Click Analytics**: Track clicks, referrers, user agents, and more
- **User Dashboard**: Manage all your shortened URLs in one place
- **Secure Authentication**: User registration and login with JWT

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- JWT Authentication
- SQLite (can be configured for PostgreSQL, MySQL)

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Query
- Recharts for data visualization

## Getting Started

### Prerequisites
- Python 3.7+
- Node.js 14+
- pnpm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Run the migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the backend server:
   ```bash
   python main.py
   ```

The backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The frontend will be available at http://localhost:5173

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

This project is licensed under the MIT License - see the LICENSE file for details.
