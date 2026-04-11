import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const jobPositions = [
  'Nhân viên kinh doanh',
  'Kế toán',
  'Marketing',
  'Hành chính nhân sự',
  'Chăm sóc khách hàng',
  'Ngân hàng',
  'IT',
];

const jobFields = [
  'Lao động phổ thông',
  'Senior',
  'Kỹ sư xây dựng',
  'Thiết kế đồ họa',
  'Bất động sản',
  'Giáo dục',
  'Telesales',
];

const navItems = [
  {
    label: 'Việc làm',
    to: '/jobs',
    chevron: true,
    dropdown: {
      columns: [
        {
          title: 'VIỆC LÀM',
          items: [
            { label: 'Tìm việc làm', to: '/jobs' },
            { label: 'Việc làm đã lưu', to: '/jobs' },
            { label: 'Việc làm đã ứng tuyển', to: '/applications' },
            { label: 'Việc làm phù hợp', to: '/jobs' },
          ],
        },
        {
          title: 'VIỆC LÀM THEO VỊ TRÍ',
          items: jobPositions.map((pos) => ({ label: pos, to: '/jobs' })),
        },
        {
          title: 'VIỆC LÀM THEO LĨNH VỰC',
          items: jobFields.map((field) => ({ label: field, to: '/jobs' })),
        },
        {
          title: 'CÔNG TY',
          items: [
            { label: 'Danh sách công ty', to: '/jobs' },
            { label: 'Công ty (Pro)', to: '/jobs', badge: 'Pro' },
          ],
        },
      ],
    },
  },
  { label: 'Tạo CV', to: '/jobs', chevron: true },
  { label: 'Công cụ', to: '/jobs', chevron: true },
  { label: 'Cẩm nang nghề nghiệp', to: '/jobs', chevron: true },
];

const profileSections = [
  {
    title: 'Quản lý tìm việc',
    defaultOpen: true,
    items: [
      { label: 'Việc làm đã lưu', to: '/jobs' },
      { label: 'Việc làm đã ứng tuyển', to: '/applications' },
      { label: 'Việc làm phù hợp với bạn', to: '/jobs' },
      { label: 'Cài đặt gợi ý việc làm', to: '/profile?tab=jobs' },
    ],
  },
  {
    title: 'Quản lý CV & Cover letter',
    defaultOpen: true,
    items: [
      { label: 'CV của tôi', to: '/profile?tab=cv' },
      { label: 'Cover Letter của tôi', to: '/profile?tab=cv' },
      { label: 'Nhà tuyển dụng muốn kết nối với bạn', to: '/profile?tab=cv' },
      { label: 'Nhà tuyển dụng xem hồ sơ', to: '/profile?tab=cv' },
    ],
  },
  {
    title: 'Cài đặt email & thông báo',
    defaultOpen: false,
    items: [{ label: 'Quản lý email & thông báo', to: '/profile?tab=email' }],
  },
  {
    title: 'Cá nhân & Bảo mật',
    defaultOpen: false,
    items: [{ label: 'Thông tin cá nhân & bảo mật', to: '/profile?tab=security' }],
  },
  {
    title: 'Nâng cấp tài khoản',
    defaultOpen: false,
    items: [{ label: 'Xem gói nâng cấp', to: '/profile?tab=upgrade' }],
  },
];

const getInitials = (user) => {
  const source = user?.full_name || user?.email || 'U';
  const parts = source.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'U';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
};

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
    <path
      d="M15 17H9m8-3V11a5 5 0 10-10 0v3l-1.5 2.5A1 1 0 006 18h12a1 1 0 00.86-1.5L17 14z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
    <path
      d="M3 8a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-5l-5 3v-3H5a2 2 0 01-2-2V8z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4 text-gray-600">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NavDropdown = ({ item }) => (
  <div className="invisible absolute left-0 top-full z-[60] w-max pt-2 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#0d0d0d] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${item.dropdown.columns.length}, 1fr)` }}>
        {item.dropdown.columns.map((column, colIdx) => (
          <div key={colIdx} className={`px-6 py-4 ${colIdx > 0 ? 'border-l border-gray-800' : ''}`}>
            <h3 className="mb-3 text-xs font-bold tracking-wide text-gray-400">{column.title}</h3>
            <ul className="space-y-2">
              {column.items.map((subItem, itemIdx) => (
                <li key={itemIdx}>
                  <Link
                    to={subItem.to}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-emerald-400"
                  >
                    {subItem.label}
                    {subItem.badge && <span className="rounded bg-orange-900 px-2 py-0.5 text-xs font-semibold text-orange-400">{subItem.badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProfileSection = ({ title, items, defaultOpen, onItemSelect }) => (
  <details className="group/section border-b border-gray-800 px-4 py-3 last:border-b-0" open={defaultOpen}>
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-gray-200">
      <span>{title}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 text-gray-400 transition group-open/section:rotate-180">
        <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </summary>
    {items.length > 0 && (
      <div className="mt-2 space-y-1 pl-4">
        {items.map((item) => (
          <Link
            key={`${title}-${item.label}`}
            to={item.to}
            onClick={onItemSelect}
            className="block w-full rounded-lg px-2 py-1 text-left text-sm font-medium text-gray-400 transition hover:bg-gray-800 hover:text-emerald-400"
          >
            {item.label}
          </Link>
        ))}
      </div>
    )}
  </details>
);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const avatarLabel = useMemo(() => getInitials(user), [user]);

  const redirectState = { from: location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify' ? '/' : `${location.pathname}${location.search}` };
  const accountCode = user?.id ? `ID ${user.id}` : 'ID chưa cập nhật';

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleProfileItemSelect = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/98 backdrop-blur-md">
      <nav className="mx-auto flex h-[72px] w-full max-w-[1360px] items-center gap-4 px-4 sm:px-6 xl:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3" onClick={() => setIsMobileMenuOpen(false)} aria-label="HotCV Home">
          <img src="/static/logo/hotcv-dark.svg" alt="HotCV" className="h-10 w-auto" />
        </Link>

        <div className="hidden items-center gap-1 lg:flex xl:gap-2">
          {navItems.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                to={item.to}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <span>{item.label}</span>
                {item.chevron && <ChevronDownIcon />}
              </Link>
              {item.dropdown && <NavDropdown item={item} />}
            </div>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
            aria-label="Thông báo"
          >
            <BellIcon />
          </button>

          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
            aria-label="Tin nhắn"
          >
            <ChatIcon />
          </button>

          {isAuthenticated ? (
            <div className="group/profile relative ml-auto">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200 text-sm font-bold text-gray-600"
                title={user?.full_name || 'User'}
                onClick={() => navigate('/profile')}
              >
                {avatarLabel}
              </button>

              <div className="invisible absolute right-0 top-full z-[70] w-[420px] pt-2 opacity-0 transition duration-200 group-hover/profile:visible group-hover/profile:opacity-100 group-focus-within/profile:visible group-focus-within/profile:opacity-100">
                <div className="rounded-2xl border border-gray-800 bg-[#0d0d0d] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]">
                  <div className="max-h-[75vh] overflow-y-auto">
                    <div className="flex items-start gap-4 border-b border-gray-800 p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-lg font-bold text-gray-300">
                      {avatarLabel}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-gray-100">{user?.full_name || 'Người dùng'}</p>
                      <p className="mt-1 text-sm font-medium text-gray-400">Tài khoản đã xác thực</p>
                      <p className="mt-1 truncate text-sm text-gray-400">{accountCode} | {user?.email || 'Chưa có email'}</p>
                    </div>
                  </div>

                  <div className="py-1">
                    {profileSections.map((section) => (
                      <ProfileSection
                        key={section.title}
                        title={section.title}
                        items={section.items}
                        defaultOpen={section.defaultOpen}
                        onItemSelect={handleProfileItemSelect}
                      />
                    ))}
                  </div>

                    <div className="sticky bottom-0 border-t border-gray-800 bg-[#0d0d0d] p-4">
                      <button
                        type="button"
                        className="w-full rounded-full bg-gray-800 px-4 py-3 text-base font-semibold text-gray-300 transition hover:bg-gray-700"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" state={redirectState} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Đăng nhập
              </Link>
              <Link to="/register" state={redirectState} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Đăng ký
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-gray-600 lg:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label="Mở menu"
          aria-expanded={isMobileMenuOpen}
        >
          ☰
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="border-t border-gray-800 bg-[#0d0d0d] px-4 py-4 lg:hidden">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{item.label}</span>
                <ChevronDownIcon />
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="grid grid-cols-1 gap-2 pt-2">
                <button type="button" className="rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700" onClick={() => navigate('/profile')}>
                  Khu vực của tôi
                </button>
                <button type="button" className="rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" state={redirectState} className="rounded-full border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                  Đăng nhập
                </Link>
                <Link to="/register" state={redirectState} className="rounded-full bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white" onClick={() => setIsMobileMenuOpen(false)}>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
