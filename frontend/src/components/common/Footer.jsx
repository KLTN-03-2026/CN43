import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-brand-bg py-12">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 xl:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">HOT CV</h3>
            <p className="text-white/60 text-sm">
              Nền tảng tuyển dụng IT hàng đầu tại Việt Nam.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-white/60 hover:text-white transition">Trang chủ</a></li>
              <li><a href="/jobs" className="text-white/60 hover:text-white transition">Việc làm</a></li>
              <li><a href="#about" className="text-white/60 hover:text-white transition">Về chúng tôi</a></li>
              <li><a href="#contact" className="text-white/60 hover:text-white transition">Liên hệ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#help" className="text-white/60 hover:text-white transition">Trợ giúp</a></li>
              <li><a href="#faq" className="text-white/60 hover:text-white transition">FAQ</a></li>
              <li><a href="#privacy" className="text-white/60 hover:text-white transition">Chính sách</a></li>
              <li><a href="#terms" className="text-white/60 hover:text-white transition">Điều khoản</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kết nối</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white">f</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white">𝕏</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white">in</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} HOT CV. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
