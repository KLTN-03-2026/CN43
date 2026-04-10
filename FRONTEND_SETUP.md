# HOT CV Frontend - Setup & Installation Guide

## 📋 Overview

The frontend has been completely refactored from vanilla JavaScript to a modern **React SPA** with:
- ⚛️ React 18 with Hooks
- 🎨 Tailwind CSS for styling
- 🔀 React Router v6 for navigation
- 🔐 Context API for state management
- ⚡ Vite for lightning-fast builds

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── components/              # Reusable React components
│   │   ├── common/             # Header, Footer, Toast
│   │   ├── home/               # Home page components  
│   │   ├── auth/               # Auth forms (Login, Register, Verify)
│   │   └── jobs/               # Job-related components
│   ├── pages/                  # Full page components
│   ├── services/               # API layer (api.js)
│   ├── context/                # State context (AuthContext, ToastContext)
│   ├── hooks/                  # Custom hooks (useAuth, useToast)
│   ├── App.jsx                 # Root component with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind imports & globals
├── index.html                  # HTML entry template
├── vite.config.js             # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies
├── README.md                   # Project documentation
└── .env.example                # Environment variables template
```

## 🚀 Installation & Setup

### Step 1: Install Dependencies

Navigate to the frontend directory and install Node packages:

```bash
cd frontend
npm install
```

This installs:
- react & react-dom
- react-router-dom (v6)
- axios (HTTP client)
- tailwindcss & postcss
- vite (build tool)

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure your API URL:

```env
# .env.local
VITE_API_URL=http://localhost:8000
```

### Step 3: Start Development Server

```bash
npm run dev
```

The frontend will start at: **http://localhost:5173**

The Vite dev server includes:
- ✅ Hot Module Replacement (HMR) - auto-reload on file changes
- ✅ Fast builds
- ✅ Source maps for debugging
- ✅ API proxy to backend

### Step 4: Backend Setup (if not already done)

In the main project directory, start the FastAPI backend:

```bash
# Terminal in the backend directory
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**

## 📱 Available Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with job search |
| `/login` | Login | User login form |
| `/register` | Register | User registration form |
| `/verify` | Verify | Email verification page |
| `/jobs` | Jobs | Job listings with filters |
| `/applications` | Applications | User's job applications |
| `/profile` | Profile | User profile page |
| `/404` | Not Found | 404 error page |

## 🔧 Development Workflow

### File Watching & Hot Reload

Changes to any file automatically reflect in the browser thanks to Vite's HMR.

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder with:
- Minified JavaScript/CSS
- Code splitting
- Asset optimization

### Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication Flow

1. **Register** → User submits form → Backend creates user
2. **Verification** → User enters OTP → Token received
3. **Login** → User submits credentials → Token received & stored
4. **Authenticated Requests** → Token auto-added to all API calls
5. **Logout** → Token removed from localStorage

Token is stored in `localStorage` with key: `jp_token`

## 🎨 Styling System

### Tailwind Configuration

Custom theme colors are defined in `tailwind.config.js`:

```javascript
colors: {
  brand: {
    bg: "#0d0d0d",      // Dark background
    accent: "#ed1c24",  // Red accent
    muted: "#a1a1aa",   // Gray text
  }
}
```

### Using Tailwind Classes

```jsx
<div className="bg-brand-bg text-white">
  <button className="bg-brand-accent hover:bg-red-600">
    Click me
  </button>
</div>
```

### Custom Utilities

Global utilities are in `src/index.css`:

```css
.btn { /* Button base styles */ }
.btn-lg { /* Large button */ }
.toast { /* Notification */ }
.form-input { /* Form input */ }
.form-label { /* Form label */ }
```

## 🔌 API Integration

### Service Layer (`src/services/api.js`)

All API calls go through centralized service:

```javascript
import { get, post, put, del } from '@/services/api';

// GET
const users = await get('/users');

// POST with body
const result = await post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// PUT
const updated = await put(`/users/${id}`, userData);

// DELETE
await del(`/jobs/${id}`);
```

### Error Handling

Errors are automatically caught and provide user-friendly messages:

```javascript
try {
  await login(email, password);
} catch (error) {
  // error.message contains user-friendly message
  showToast(error.message, true); // Show as error toast
}
```

### Auth Headers

Token is automatically included in all requests:

```javascript
// Service automatically adds:
// Authorization: Bearer {token}
```

## 🪝 Custom Hooks

### useAuth Hook

Access authentication state and methods:

```javascript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### useToast Hook

Show notifications to users:

```javascript
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { showToast } = useToast();
  
  const handleClick = () => {
    showToast('Success!', false); // Success notification
    // or
    showToast('Error occurred!', true); // Error notification
  };
  
  return <button onClick={handleClick}>Click</button>;
}
```

## 🧩 Component Structure

### Page Components (Full Pages)

Located in `src/pages/`, these are full page components:

```javascript
// src/pages/Home.jsx
export const Home = () => {
  return (
    <div>
      <HeroBanner />
      <SearchBar />
      {/* More content */}
    </div>
  );
};
```

### Reusable Components

Located in `src/components/`, these are smaller reusable pieces:

```javascript
// src/components/common/Header.jsx
export const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <header>
      {/* Navigation */}
    </header>
  );
};
```

## 🌍 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API URL |
| `VITE_DEBUG` | `false` | Enable debug logging |

## 🐛 Debugging

### Browser DevTools

- Use React Developer Tools extension for Chrome/Firefox
- Inspect component state, props, and hooks
- View Network tab for API calls

### Console Logging

```javascript
console.log('Debug:', state);
console.error('Error:', error);
```

## 🚀 Building for Deployment

### Production Build

```bash
npm run build
```

Outputs to `dist/` folder.

### Deployment Checklist

- [ ] Build completes without errors
- [ ] Set production `VITE_API_URL`
- [ ] Test all routes work
- [ ] Test auth flow (login/register/verify)
- [ ] Test API integration
- [ ] Verify assets load correctly
- [ ] Check console for errors

## 🔗 Connecting to Backend

Ensure backend is running on port 8000 and update API URL if different:

```env
# .env.local
VITE_API_URL=https://your-production-api.com
```

The API service will automatically:
- Add `/api` prefix if path doesn't start with `http`
- Include auth token in requests
- Parse JSON responses
- Handle errors gracefully

## 📦 Project Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI framework |
| react-dom | 18.3.1 | DOM rendering |
| react-router-dom | 6.28.0 | Client-side routing |
| vite | 5.4.11 | Build tool |
| tailwindcss | 3.4.14 | CSS framework |
| axios | 1.7.7 | HTTP client (optional) |

## ❓ Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 5174
```

### Blank page on load
- Check browser console for errors
- Verify `index.html` exists
- Ensure `VITE_API_URL` is correct

### API requests failing
- Verify backend is running on correct port
- Check `VITE_API_URL` in `.env.local`
- Look at Network tab in browser DevTools
- Check backend CORS settings

### Styling not working
- Clear browser cache
- Run `npm run build` and check `dist/` folder
- Verify Tailwind config is correct

## 📚 File Map

```
src/
├── App.jsx                          # Root component, routes
├── main.jsx                         # Entry point
├── index.css                        # Tailwind + global styles
├── components/
│   ├── common/
│   │   ├── Header.jsx               # Navigation
│   │   ├── Footer.jsx               # Footer
│   │   └── Toast.jsx                # Notifications
│   ├── home/
│   │   ├── HeroBanner.jsx           # Hero section
│   │   ├── SearchBar.jsx            # Job search
│   │   ├── CompanyCard.jsx          # Company card
│   │   └── SkillTag.jsx             # Skill tag button
│   ├── auth/
│   │   ├── LoginForm.jsx            # Login form
│   │   ├── RegisterForm.jsx         # Registration form
│   │   └── VerificationForm.jsx     # OTP verification
│   └── jobs/
│       └── JobCard.jsx              # Job listing card
├── pages/
│   ├── Home.jsx                     # Home page
│   ├── Login.jsx                    # Login page
│   ├── Register.jsx                 # Register page
│   ├── Verify.jsx                   # Verify page
│   ├── Jobs.jsx                     # Jobs listing
│   ├── Applications.jsx             # My applications
│   ├── Profile.jsx                  # User profile
│   └── NotFound.jsx                 # 404 page
├── services/
│   └── api.js                       # API client
├── context/
│   ├── AuthContext.jsx              # Auth state
│   └── ToastContext.jsx             # Toast state
└── hooks/
    ├── useAuth.js                   # Auth hook
    └── useToast.js                  # Toast hook
```

## ✅ Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Copy `.env.example` to `.env.local`
3. ✅ Configure API URL in `.env.local`
4. ✅ Start dev server: `npm run dev`
5. ✅ Start backend: `uvicorn app.main:app --reload`
6. 🔄 Test frontend at http://localhost:5173
7. 🔄 Test login/register/verify flows
8. 🔄 Test API integration

## 🎉 You're All Set!

Your React frontend is ready to go. Start developing and enjoying the modern React workflow!

---

For more details, see [README.md](./README.md)
