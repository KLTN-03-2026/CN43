import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const PageShell = ({ children }) => {
	return (
		<div className="min-h-screen bg-brand-bg text-white">
			<Header />
			<main className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 xl:px-8">{children}</main>
			<Footer />
			<Toast />
		</div>
	);
};

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <div className="py-12 text-center text-white/60">Đang tải...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
	}

	return children;
};

const AppRoutes = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<PageShell>
						<Home />
					</PageShell>
				}
			/>
			<Route
				path="/login"
				element={
					<PageShell>
						<Login />
					</PageShell>
				}
			/>
			<Route
				path="/register"
				element={
					<PageShell>
						<Register />
					</PageShell>
				}
			/>
			<Route
				path="/verify"
				element={
					<PageShell>
						<Verify />
					</PageShell>
				}
			/>
			<Route
				path="/jobs"
				element={
					<PageShell>
						<Jobs />
					</PageShell>
				}
			/>
			<Route
				path="/applications"
				element={
					<ProtectedRoute>
						<PageShell>
							<Applications />
						</PageShell>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/profile"
				element={
					<ProtectedRoute>
						<PageShell>
							<Profile />
						</PageShell>
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<PageShell><NotFound /></PageShell>} />
		</Routes>
	);
};

export const App = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<ToastProvider>
					<AppRoutes />
				</ToastProvider>
			</AuthProvider>
		</BrowserRouter>
	);
};

export default App;
