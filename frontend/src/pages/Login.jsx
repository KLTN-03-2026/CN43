import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();
	const redirectTo = location.state?.from || '/';

	if (isLoading) {
		return <div className="py-12 text-center text-white/60">Đang tải...</div>;
	}

	if (isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	return <LoginForm />;
};

export default Login;
