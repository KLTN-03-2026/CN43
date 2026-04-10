# Frontend & Backend Integration Guide

## 🔗 Connecting Frontend to Backend

This guide explains how to ensure frontend and backend communicate correctly.

## 📡 API Base URLs

### Development
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **Frontend API Proxy**: http://localhost:5173/api

### Configuration

Update `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

## 🔐 CORS Configuration

For the frontend to make requests to the backend, CORS must be enabled.

### FastAPI CORS Setup

Update `app/main.py` to include CORS middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, update the `allow_origins` list:

```python
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

## 🔄 API Flow

```
Frontend Request
    ↓
Service Layer (src/services/api.js)
    ↓ Adds auth token
Request with Bearer Token
    ↓
Backend (API Routes)
    ↓ Validates token
Response
    ↓
Frontend (State Update)
    ↓
UI Changes
```

## 📝 API Endpoints Used by Frontend

### Authentication

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/verify` | Verify email with OTP |
| GET | `/users/me` | Get current user |

### Jobs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/jobs` | List all jobs |
| GET | `/jobs/{id}` | Get job details |

### Applications

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/applications` | List user's applications |
| POST | `/applications` | Submit application |

### Users

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users/me` | Get user profile |
| PUT | `/users/me` | Update user profile |

## 🔑 Token Management

### Token Storage

- **Stored in**: `localStorage` with key `jp_token`
- **Persists across**: Browser sessions
- **Cleared on**: Logout

### Token Auto-Attach

All requests automatically include token:

```javascript
// In src/services/api.js
if (token) {
  headers.Authorization = `Bearer ${token}`;
}
```

## ❌ Common Issues & Solutions

### Issue: CORS Error

**Error**: `Access to XMLHttpRequest... has been blocked by CORS policy`

**Solution**: Add CORS middleware to FastAPI backend (see above)

### Issue: 401 Unauthorized

**Error**: `{"detail":"Not authenticated"}`

**Possible Causes**:
- Token not included in request
- Token expired
- Token invalid

**Solution**:
- Check token in localStorage
- Try logging in again
- Verify backend token validation

### Issue: API Not Responding

**Error**: `Failed to fetch` or timeout

**Causes**:
- Backend not running
- Wrong API URL in `.env.local`
- Firewall blocking requests

**Solution**:
- Start backend: `uvicorn app.main:app --reload`
- Verify API URL: http://localhost:8000
- Check `curl http://localhost:8000/health` in terminal

### Issue: Blank Page

**Error**: White screen, no content

**Causes**:
- Frontend build error
- API failing to initialize
- Runtime error

**Solution**:
- Check browser console for errors
- Check Network tab for failed requests
- Verify API URL is correct

## 🧪 Testing API Integration

### Test Backend Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "ok"}
```

### Test API Request from Frontend

In browser console:

```javascript
// In Console tab:
fetch('http://localhost:8000/jobs')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

### Test Auth Token

```javascript
// In Console tab:
const token = localStorage.getItem('jp_token');
console.log('Token:', token);

// Make authenticated request
fetch('http://localhost:8000/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(d => console.log(d))
```

## 🚀 Running Both Frontend & Backend

### Quick Start (Two Terminals)

**Terminal 1 - Backend**:
```bash
cd d:\job-portal-backend
.venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend**:
```bash
cd d:\job-portal-backend\frontend
npm install  # Only first time
npm run dev
```

### With npm scripts

You can create a script to run both:

**frontend/package.json**:
```json
{
  "scripts": {
    "dev": "vite",
    "dev:full": "npm run dev & cd ../&& uvicorn app.main:app --reload"
  }
}
```

## 📦 Production Deployment

### Environment Variables

**Backend** (`app/.env` or environment):
```
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
FRONTEND_URL=https://yourdomain.com
```

**Frontend** (`frontend/.env.local` or build-time):
```
VITE_API_URL=https://api.yourdomain.com
```

### CORS for Production

Update `app/main.py`:
```python
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    "https://app.yourdomain.com"
]
```

## 🔄 API Request/Response Cycle

### Example: User Login

**Frontend Request**:
```javascript
const response = await post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

**HTTP Request**:
```http
POST /auth/login HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{"email":"user@example.com","password":"password123"}
```

**Backend Processing**:
- Validates credentials
- Generates JWT token
- Returns token and user data

**HTTP Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

**Frontend Processing**:
- Stores token in localStorage
- Updates auth state
- Redirects to home page

## 📊 Debugging Network Requests

### Browser DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (login, search, etc.)
4. Click request to see details:
   - **Headers**: Auth token, content-type
   - **Request**: Payload sent
   - **Response**: Server response
   - **Timing**: Request duration

### Postman Testing

Test backend endpoints directly:

1. Create new request
2. Set method (GET, POST, etc.)
3. Enter URL: `http://localhost:8000/endpoint`
4. Add headers:
   - `Authorization: Bearer {token}`
   - `Content-Type: application/json`
5. Add body if needed
6. Send request

## ✅ Checklist for Integration

- [ ] Backend CORS configured
- [ ] `VITE_API_URL` set in frontend .env
- [ ] Backend running on correct port
- [ ] Frontend running on correct port
- [ ] Token persists in localStorage
- [ ] Auth requests include token
- [ ] API endpoints match backend routes
- [ ] Error handling works
- [ ] No console errors
- [ ] No network failures

## 📚 Related Files

- Backend: `app/main.py` (CORS configuration)
- Frontend: `frontend/src/services/api.js` (API client)
- Frontend: `frontend/src/context/AuthContext.jsx` (Auth state)
- Frontend: `frontend/.env.example` (Environment template)

---

For more help, check the individual README files in backend and frontend directories.
