# RPC Sentinel Backend

FastAPI backend for RPC provider monitoring and management.

## Features

- **JWT Authentication**: Secure user authentication with JWT tokens
- **Provider Monitoring**: Track RPC provider health and uptime
- **API Key Management**: Generate and manage API keys
- **Real-time Metrics**: Monitor provider performance and alerts
- **Background Tasks**: Automated health checks every 5 minutes
- **SQLite Database**: Lightweight, file-based database (easily switchable to PostgreSQL)

## Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
   - Copy `.env` and update the `SECRET_KEY` for production
   - The default configuration uses SQLite and runs on port 8000

### Running the Server

Start the development server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Providers
- `GET /api/providers` - List all providers
- `POST /api/providers` - Add new provider
- `GET /api/providers/{id}` - Get provider details
- `PUT /api/providers/{id}` - Update provider
- `DELETE /api/providers/{id}` - Delete provider
- `POST /api/providers/{id}/check` - Trigger manual health check

### API Keys
- `GET /api/keys` - List API keys
- `POST /api/keys` - Create new API key
- `DELETE /api/keys/{id}` - Delete API key

### Metrics
- `GET /api/metrics/uptime` - Get uptime statistics
- `GET /api/metrics/usage` - Get usage statistics
- `GET /api/metrics/realtime` - Get real-time metrics
- `GET /api/alerts` - Get provider alerts

## Database

The application uses SQLite by default. The database file `rpc_sentinel.db` will be created automatically in the backend directory.

To switch to PostgreSQL, update the `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost/rpc_sentinel
```

## Background Tasks

The application runs periodic health checks every 5 minutes (configurable via `HEALTH_CHECK_INTERVAL_MINUTES` in `.env`).

## Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days (configurable)
- CORS is configured to allow requests from the frontend

**Important**: Change the `SECRET_KEY` in `.env` before deploying to production!

## Development

To run in development mode with auto-reload:
```bash
uvicorn main:app --reload --port 8000
```

## Production Deployment

For production, use a production-grade ASGI server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Or use Gunicorn with Uvicorn workers:
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
