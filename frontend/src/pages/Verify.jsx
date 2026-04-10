import React from 'react';
import { Navigate } from 'react-router-dom';
import VerificationForm from '../components/auth/VerificationForm';
import { useAuth } from '../hooks/useAuth';

export const Verify = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="py-12 text-center text-white/60">Đang tải...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <VerificationForm />;
};

export default Verify;
