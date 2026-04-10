# Job Portal Backend - Setup & Development Guide

## Quick Start

### 1. Setup Environment
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
# Copy example to actual config
cp .env.example .env

# Edit .env with your settings:
# - GEMINI_API_KEY: Get from https://console.cloud.google.com
# - SMTP_HOST: Your email provider SMTP (e.g., smtp.gmail.com)
# - SMTP_USERNAME/PASSWORD: Email credentials
# - SECRET_KEY: Change to a long random string for production
```

### 3. Run Server
```bash
uvicorn app.main:app --reload
```

Server will start at `http://localhost:8000`
- API Docs: http://localhost:8000/docs (Swagger UI)
- ReDoc: http://localhost:8000/redoc

---

## Project Structure (Spec Driven)

```
app/
├── main.py                 # FastAPI app entry point
├── config.py              # Settings (from .env)
├── database.py            # SQLAlchemy setup & sessions
├── security.py            # JWT & password utilities
├── deps.py                # Role-based auth dependencies
├── errors.py              # ✨ Centralized error codes & messages
│
├── models/                # SQLAlchemy ORM models
│   ├── user.py           # User (employer/candidate)
│   ├── job.py            # Job posting
│   └── application.py    # Job application with CV
│
├── schemas/               # Pydantic request/response schemas
│   ├── user.py           # Auth & user schemas
│   ├── job.py            # Job schemas
│   └── application.py    # Application & AI result schemas
│
├── routers/               # FastAPI routers (endpoints)
│   ├── auth.py           # /auth/* endpoints
│   ├── jobs.py           # /jobs/* endpoints
│   └── applications.py   # /applications/* endpoints
│
└── services/              # Business logic & external APIs
    ├── ai_screening.py   # Gemini API integration
    ├── cv_text.py        # PDF text extraction
    └── mailer.py         # Email & OTP sending

SPEC.md                     # Complete API specification
```

---

## Spec Driven Development Pattern

This project follows **Specification-Driven Development (SDD)** where:

1. **Spec First** (`SPEC.md`) - Complete API specification before code
2. **Consistent Errors** - All error messages via `errors.py`
3. **Typed Schemas** - Pydantic models with descriptions & examples
4. **Documentation** - Every module has docstrings and type hints
5. **Role-Based Access** - Dependency injection with `EmployerUser`, `CandidateUser`, `AnyAuthUser`

---

## Key Endpoints

### Authentication
```
POST   /auth/register          # Register new user
POST   /auth/verify-otp        # Verify email with OTP
POST   /auth/resend-otp        # Resend OTP code
POST   /auth/login             # Login & get JWT
GET    /auth/me                # Get current user profile
```

### Jobs (Employer)
```
POST   /jobs                   # Create job posting
GET    /jobs                   # List active jobs
GET    /jobs/{job_id}         # Get job details
GET    /jobs/mine/list        # List my jobs (employer)
PATCH  /jobs/{job_id}         # Update job (employer)
DELETE /jobs/{job_id}         # Delete job (employer)
```

### Applications (Candidate)
```
POST   /applications                    # Apply to job
POST   /applications/{app_id}/cv       # Upload CV (PDF)
GET    /applications/mine              # List my applications
GET    /applications/job/{job_id}      # List job applications (employer)
POST   /applications/screen            # AI screen application
```

---

## Error Handling

All API errors are centralized in `app/errors.py`:

```python
from app.errors import ErrorCode, get_error_detail

# In endpoint:
if not job:
    raise HTTPException(
        status_code=404,
        detail=get_error_detail(ErrorCode.JOB_NOT_FOUND)
    )
```

Error messages are in Vietnamese for user-facing responses.

---

## Authentication Flow

1. **Register**: User creates account with email + password
2. **OTP Verification**: Email sent with 6-digit code (valid 10 min)
3. **Verify**: User enters OTP to confirm email
4. **Login**: User logs in with email + password → JWT token
5. **Authenticated Requests**: Include `Authorization: Bearer {token}` header

**Default Expiry**: 24 hours (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`)

---

## AI CV Screening

### Requirements
- **API Key**: Set `GEMINI_API_KEY` in .env
- **Model**: `gemini-2.0-flash` (configurable)
- **Behavior**:
  - CV + Job details sent to Gemini
  - Returns JSON with score (0-100) + analysis in Vietnamese
  - **Mock Mode**: If `GEMINI_API_KEY` not set, returns mock results for dev

### Endpoint
```bash
POST /applications/screen
{
  "application_id": 1
}
```

### Response
```json
{
  "score": 85.5,
  "summary": "Ứng viên phù hợp với vị trí",
  "strengths": "5 năm kinh nghiệm Python; Biết FastAPI; ...",
  "gaps": "Chưa có kinh nghiệm AWS; ..."
}
```

---

## File Upload

### PDF CV Upload
```bash
POST /applications/{application_id}/cv
Content-Type: multipart/form-data
file: <pdf_file>
```

### Constraints
- File type: PDF only
- Max size: Configurable (default 10MB via `MAX_UPLOAD_MB`)
- Extracted to: `./uploads/{application_id}_{uuid}.pdf`

---

## Development Tips

### Run with Debug Output
```bash
# Enable SQL logging
SQLALCHEMY_ECHO=true uvicorn app.main:app --reload
```

### Test Authentication
```bash
# Get token
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"

# Use token in subsequent requests
curl http://localhost:8000/auth/me \
  -H "Authorization: Bearer {token}"
```

### Test with Swagger UI
- Open http://localhost:8000/docs
- Click "Authorize" button to login
- Try endpoints directly from UI

---

## Database

### Type
- SQLite (development) - `job_portal.db`
- Easily switch to PostgreSQL by changing `DATABASE_URL`

### Auto-Migration
- Tables created automatically on startup
- Schema in `app/models/`
- Backward compatibility migrations in `database.py`

### Schema
```
users
├── id (PK)
├── email (unique, indexed)
├── hashed_password
├── full_name
├── role (enum: employer/candidate)
├── is_verified, otp_code, otp_expires_at
└── created_at

jobs
├── id (PK)
├── employer_id (FK)
├── title, description, requirements, location
├── is_active
└── created_at

applications
├── id (PK)
├── job_id (FK)
├── candidate_id (FK)
├── cv_text, cv_file_path
├── ai_score, ai_summary, ai_strengths, ai_gaps
├── ai_screened_at
└── created_at
```

---

## Production Checklist

- [ ] Change `SECRET_KEY` to long random string
- [ ] Set `ALGORITHM` correctly in config
- [ ] Configure SMTP for email sending (disable debug mode)
- [ ] Set `GEMINI_API_KEY` for AI screening
- [ ] Switch database to PostgreSQL
- [ ] Set `SQLALCHEMY_ECHO = false`
- [ ] Configure CORS origins (not `["*"]`)
- [ ] Use HTTPS for API
- [ ] Set up monitoring & logging
- [ ] Add rate limiting
- [ ] Run tests before deployment

---

## Testing

### Manual Testing
Use Swagger UI at http://localhost:8000/docs

### Automated Testing
```bash
# Create test file: tests/test_api.py
pytest tests/
```

---

## Troubleshooting

### SMTP Error
```
Chưa cấu hình SMTP để gửi OTP
```
→ Set SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD in .env, or set SMTP_DEBUG=true

### Gemini API Error
```
<API error message>
```
→ Check GEMINI_API_KEY is set and valid

### Permission Denied
```
Không đủ quyền để thực hiện hành động này
```
→ Ensure logged in user has correct role. Use `/auth/me` to verify.

### Database Lock
```
database is locked
```
→ Close other processes accessing job_portal.db

---

## API Documentation

Full API specification: **See [SPEC.md](./SPEC.md)**

Key sections:
- [Core Entities](./SPEC.md#core-entities--data-model)
- [API Endpoints](./SPEC.md#api-endpoints-specification)
- [Authentication](./SPEC.md#authentication--security)
- [Error Handling](./SPEC.md#error-handling)
- [Configuration](./SPEC.md#configuration)

---

**Version**: 1.0.0
**Last Updated**: 2026-03-30
**Spec-Driven Development** 🎯
