# HOT CV Frontend - React

A modern React-based frontend for the HOT CV job portal application.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── common/         # Header, Footer, Toast
│   │   ├── home/           # Home page components
│   │   ├── auth/           # Auth forms (Login, Register, Verify)
│   │   └── jobs/           # Job-related components
│   ├── pages/              # Page components (full pages)
│   ├── services/           # API service layer
│   ├── context/            # React Context (Auth, Toast)
│   ├── hooks/              # Custom React hooks
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css            # Tailwind CSS imports
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Dependencies
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Configuration

- **API Base URL**: Set `VITE_API_URL` environment variable (defaults to `http://localhost:8000`)
- **Port**: Dev server runs on port 5173 (configurable in `vite.config.js`)

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## 🎨 Styling

The project uses Tailwind CSS for styling with custom theme extending:

- **Colors**: Brand colors (bg, accent, muted) defined in `tailwind.config.js`
- **Utilities**: Custom Tailwind utilities defined in `src/index.css`

## 🔐 Authentication

Authentication is managed through:
- **AuthContext**: Centralized auth state management
- **useAuth Hook**: Easy access to auth state and methods
- **API Service**: Handles token management and requests

### Auth Flow

1. User registers/logs in
2. Token is stored in localStorage
3. Auth state is persisted on app reload
4. Protected routes check `isAuthenticated` status

## 📡 API Integration

All API requests go through the centralized API service (`src/services/api.js`):

```javascript
import { get, post, put, del } from './services/api';

// GET request
const data = await get('/endpoint');

// POST request
const result = await post('/endpoint', { body });

// PUT request
const updated = await put('/endpoint', { body });

// DELETE request
await del('/endpoint');
```

## 🧩 Components

### Common Components
- **Header**: Navigation bar
- **Footer**: Footer with links
- **Toast**: Notification system

### Home Components
- **HeroBanner**: Hero section
- **SearchBar**: Job search form
- **CompanyCard**: Company showcase
- **SkillTag**: Skill tag button

### Auth Components
- **LoginForm**: Login page form
- **RegisterForm**: Registration form
- **VerificationForm**: Email verification

### Job Components
- **JobCard**: Single job item
- **JobCardFull**: Detailed job card

## 🎯 Pages

- **/**: Home page
- **/login**: Login page
- **/register**: Registration page
- **/verify**: Email verification page
- **/jobs**: Jobs listing page
- **/applications**: My applications
- **/profile**: User profile
- **/404**: Not found page

## 📦 Build & Deployment

Build for production:

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment Notes
- Set `VITE_API_URL` to production API URL
- Configure CORS if backend is on different domain
- Use a production-grade web server (nginx, Apache, etc.)

## 🐛 Debugging

Enable debugging in browser DevTools:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

## 📚 Tech Stack

- **React** 18.3.1 - UI framework
- **React Router** 6.28.0 - Routing
- **Vite** 5.4.11 - Build tool
- **Tailwind CSS** 3.4.14 - Styling
- **Axios** 1.7.7 - HTTP client

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 Notes

- All API endpoints are prefixed with backend base URL
- Token is automatically included in auth headers
- Error messages are user-friendly Vietnamese text
- Toast notifications for success/error feedback
- Fully responsive design (mobile, tablet, desktop)

## 🔗 Related

- Backend: [FastAPI Job Portal Backend](../README.md)
- API Documentation: Available at backend `/docs` endpoint

---

Made with ❤️ for HOT CV
