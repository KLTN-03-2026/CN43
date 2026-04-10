import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

export const Register = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="py-12 text-center text-white/60">Đang tải...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <RegisterForm />;
};

export default Register;
