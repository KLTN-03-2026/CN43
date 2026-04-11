import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const ChevronIcon = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
  >
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PanelIcon = ({ children, active = false }) => (
  <span
    className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold ${
      active ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-white/10 bg-white/5 text-white/80'
    }`}
  >
    {children}
  </span>
);

const initialsFromUser = (user) => {
  const source = user?.full_name || user?.email || 'User';
  const parts = source.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'U';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
};

const menuGroups = [
  {
    key: 'jobs',
    title: 'Quản lý tìm việc',
    icon: '🧭',
    defaultOpen: true,
    items: ['Việc làm đã lưu', 'Việc làm đã ứng tuyển', 'Việc làm phù hợp với bạn', 'Cài đặt gợi ý việc làm'],
  },
  {
    key: 'cv',
    title: 'Quản lý CV & Cover letter',
    icon: 'CV',
    defaultOpen: true,
    items: ['CV của tôi', 'Cover Letter của tôi', 'Nhà tuyển dụng muốn kết nối với bạn', 'Nhà tuyển dụng xem hồ sơ'],
  },
  {
    key: 'email',
    title: 'Cài đặt email & thông báo',
    icon: '✉',
    defaultOpen: false,
    items: ['Nhận email việc làm mới', 'Nhắc cập nhật hồ sơ', 'Thông báo từ nhà tuyển dụng'],
  },
  {
    key: 'security',
    title: 'Cá nhân & Bảo mật',
    icon: '◔',
    defaultOpen: false,
    items: ['Thông tin cá nhân', 'Đổi mật khẩu', 'Quyền riêng tư tài khoản'],
  },
  {
    key: 'upgrade',
    title: 'Nâng cấp tài khoản',
    icon: '+',
    defaultOpen: false,
    items: ['HOT CV Pro', 'Gói hỗ trợ nổi bật hồ sơ', 'Liên hệ tư vấn'],
  },
];

export const Profile = () => {
  const { isAuthenticated, user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [fullNameDraft, setFullNameDraft] = useState(user?.full_name || '');
  const [openSections, setOpenSections] = useState(() =>
    menuGroups.reduce((accumulator, group) => {
      accumulator[group.key] = group.defaultOpen;
      return accumulator;
    }, {})
  );

  const avatarText = useMemo(() => initialsFromUser(user), [user]);
  const activeTab = searchParams.get('tab');
  const activeTabKey = menuGroups.some((group) => group.key === activeTab) ? activeTab : null;

  useEffect(() => {
    if (!activeTabKey) {
      return;
    }

    setMenuExpanded(true);
    setOpenSections(
      menuGroups.reduce((accumulator, group) => {
        accumulator[group.key] = group.key === activeTabKey;
        return accumulator;
      }, {})
    );
  }, [activeTabKey]);

  useEffect(() => {
    setFullNameDraft(user?.full_name || '');
  }, [user?.full_name]);

  const toggleSection = (key) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const startEditProfile = () => {
    setFullNameDraft(user?.full_name || '');
    setIsEditingProfile(true);
  };

  const cancelEditProfile = () => {
    setFullNameDraft(user?.full_name || '');
    setIsEditingProfile(false);
  };

  const submitProfileUpdate = async () => {
    const normalizedName = fullNameDraft.trim();
    if (!normalizedName) {
      showToast('Họ và tên không được để trống', true);
      return;
    }

    try {
      setIsSavingProfile(true);
      await updateProfile({ full_name: normalizedName });
      setIsEditingProfile(false);
      showToast('Cập nhật hồ sơ thành công');
    } catch (error) {
      showToast(error?.message || 'Không thể cập nhật hồ sơ', true);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 mb-4">Vui lòng đăng nhập để xem hồ sơ của bạn</p>
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
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
        <button
          type="button"
          onClick={() => setMenuExpanded((current) => !current)}
          className="flex w-full items-center gap-4 border-b border-white/10 px-5 py-4 text-left transition hover:bg-white/[0.03]"
          aria-expanded={menuExpanded}
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white text-xl font-bold text-slate-500">
            {avatarText}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-white">{user?.full_name || 'Quản trị viên'}</p>
            <p className="text-sm text-white/70">Tài khoản đã xác thực</p>
            <p className="mt-1 truncate text-sm text-white/65">
              ID {user?.id || '10611521'} | {user?.email || 'user@example.com'}
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70">
            <ChevronIcon open={menuExpanded} />
          </span>
        </button>

        {menuExpanded && (
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {menuGroups.map((group) => {
                const isOpen = openSections[group.key];

                return (
                  <div key={group.key} className="rounded-2xl px-2 py-1">
                    <button
                      type="button"
                      onClick={() => toggleSection(group.key)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition hover:bg-white/[0.04] ${
                        group.key === activeTabKey ? 'bg-white/[0.05]' : ''
                      }`}
                      aria-expanded={isOpen}
                    >
                      <PanelIcon active={isOpen || group.key === activeTabKey}>{group.icon}</PanelIcon>
                      <span className={`flex-1 text-[15px] font-semibold ${group.key === activeTabKey ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {group.title}
                      </span>
                      <span className="text-slate-400">
                        <ChevronIcon open={isOpen} />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-1 space-y-1 pl-14 pr-2 pb-2">
                        {group.items.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="block w-full rounded-xl px-3 py-2 text-left text-[14px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </aside>

      <section className="space-y-6">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-accent/90">Hồ sơ của tôi</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Quản lý thông tin cá nhân</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Cập nhật thông tin để nhà tuyển dụng hiểu rõ hơn về bạn và để các mục trong menu tài khoản hoạt động đúng ngữ cảnh.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="form-label">Email</label>
              <p className="mt-2 text-white/80">{user?.email}</p>
            </div>

            <div>
              <label className="form-label">Họ và tên</label>
              {isEditingProfile ? (
                <input
                  value={fullNameDraft}
                  onChange={(event) => setFullNameDraft(event.target.value)}
                  maxLength={255}
                  className="mt-2 w-full rounded-lg border border-white/20 bg-white/[0.04] px-3 py-2 text-white outline-none transition focus:border-brand-accent"
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <p className="mt-2 text-white/80">{user?.full_name || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="form-label">Số điện thoại</label>
              <p className="mt-2 text-white/80">{user?.phone || 'N/A'}</p>
            </div>

            <div>
              <label className="form-label">Trạng thái</label>
              <p className="mt-2 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
                Đã xác thực
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isEditingProfile ? (
              <>
                <button
                  type="button"
                  className="rounded-lg bg-brand-accent px-6 py-3 font-semibold text-white transition hover:bg-[#cf141b] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={submitProfileUpdate}
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/15 px-6 py-3 font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={cancelEditProfile}
                  disabled={isSavingProfile}
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                type="button"
                className="rounded-lg bg-brand-accent px-6 py-3 font-semibold text-white transition hover:bg-[#cf141b]"
                onClick={startEditProfile}
              >
                Chỉnh sửa hồ sơ
              </button>
            )}
            <button
              type="button"
              className="rounded-lg border border-white/15 px-6 py-3 font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/[0.04]"
            >
              Xem CV của tôi
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
