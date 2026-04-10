import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Applications = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 mb-4">Vui lòng đăng nhập để xem ứng tuyển của bạn</p>
        <button
          onClick={() => navigate('/login')}
          className="rounded-lg bg-brand-accent px-6 py-2 font-semibold text-white hover:bg-[#cf141b] transition"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <h1 className="text-3xl font-bold text-white mb-8">Lịch sử ứng tuyển</h1>

      <div className="text-center py-12">
        <p className="text-white/60">Bạn chưa ứng tuyển vị trí nào</p>
      </div>
    </div>
  );
};

export default Applications;
