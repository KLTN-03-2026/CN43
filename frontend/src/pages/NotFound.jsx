import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container text-center py-20">
      <h1 className="text-6xl font-bold text-brand-accent mb-4">404</h1>
      <p className="text-3xl font-bold text-white mb-2">Trang không tìm thấy</p>
      <p className="text-white/60 mb-8">Xin lỗi, trang bạn tìm kiếm không tồn tại.</p>

      <button
        onClick={() => navigate('/')}
        className="rounded-lg bg-brand-accent px-8 py-3 font-semibold text-white hover:bg-[#cf141b] transition"
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default NotFound;
