import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const EyeIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
		<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" />
		<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
	</svg>
);

const EyeOffIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
		<path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		<path d="M10.6 6.3A10.8 10.8 0 0112 6c6.5 0 10 6 10 6a17.9 17.9 0 01-3.3 4.1M6.7 9.2A17.8 17.8 0 002 12s3.5 6 10 6a10 10 0 003.2-.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
	</svg>
);

const GoogleIcon = () => <span className="text-sm font-bold">G</span>;
const GithubIcon = () => <span className="text-sm font-bold">GH</span>;
const LinkedinIcon = () => <span className="text-sm font-bold">in</span>;

export const LoginForm = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, isLoading } = useAuth();
	const { showToast } = useToast();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const redirectTo = location.state?.from || '/';
	const registerState = { from: location.state?.from || '/' };

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!email || !password) {
			showToast('Vui lòng nhập email và mật khẩu', true);
			return;
		}

		if (typeof login !== 'function') {
			showToast('Hệ thống đăng nhập chưa sẵn sàng', true);
			return;
		}

		try {
			await login(email.trim(), password, { rememberMe });
			showToast('Đăng nhập thành công');
			navigate(redirectTo, { replace: true });
		} catch (error) {
			showToast(error?.message || 'Đăng nhập thất bại', true);
		}
	};

	return (
		<div className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] w-full items-center justify-center overflow-hidden bg-[#000] px-4 py-8 sm:px-6">

			<div className="relative z-10 w-full max-w-[460px] rounded-[28px] border border-white/15 bg-gradient-to-b from-[#1b1e2a]/90 to-[#131621]/90 p-7 shadow-[0_24px_90px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-9">
				<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
					<img src="/static/logo/hotcv-icon.svg" alt="HOT CV icon" className="h-14 w-14" />
				</div>

				<h1 className="mt-7 text-center text-5xl font-extrabold leading-none tracking-tight text-white sm:text-6xl">
					Đăng Nhập
				</h1>
				<p className="mt-3 text-center text-base text-white/65 sm:text-lg">
					Chưa có tài khoản?{' '}
					<Link to="/register" state={registerState} className="font-semibold text-red-500 transition hover:text-red-400">
						Đăng ký ngay
					</Link>
				</p>

				<form onSubmit={handleSubmit} className="mt-8 space-y-4">
					<input
						id="login-email"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						autoComplete="email"
						placeholder="Địa chỉ email"
						className="h-14 w-full rounded-xl border border-white/20 bg-white/[0.04] px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-red-400/80 focus:ring-4 focus:ring-red-500/15"
						required
					/>

					<div className="relative">
						<input
							id="login-password"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							autoComplete="current-password"
							placeholder="Mật khẩu"
							className="h-14 w-full rounded-xl border border-white/20 bg-white/[0.04] px-4 pr-12 text-base text-white outline-none transition placeholder:text-white/35 focus:border-red-400/80 focus:ring-4 focus:ring-red-500/15"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword((visible) => !visible)}
							className="absolute inset-y-0 right-3 inline-flex items-center text-white/55 transition hover:text-white"
							aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
						>
							{showPassword ? <EyeOffIcon /> : <EyeIcon />}
						</button>
					</div>

					<div className="flex items-center justify-between px-1 text-sm text-white/60">
						<label className="inline-flex items-center gap-2">
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={(event) => setRememberMe(event.target.checked)}
								className="h-4 w-4 rounded border-white/30 bg-transparent text-red-500 focus:ring-red-500/40"
							/>
							Ghi nhớ đăng nhập
						</label>
					</div>

					<button
						type="submit"
						disabled={Boolean(isLoading)}
						className="mt-2 flex h-14 w-full items-center justify-center rounded-xl bg-[#ef1f2d] text-xl font-bold text-white shadow-[0_12px_35px_rgba(239,31,45,0.45)] transition hover:bg-[#ff2b3a] disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
					</button>
				</form>

				<div className="mt-7 flex items-center gap-3 text-sm text-white/45">
					<div className="h-px flex-1 bg-white/15" />
					<span>hoặc</span>
					<div className="h-px flex-1 bg-white/15" />
				</div>

				<div className="mt-6 grid grid-cols-3 gap-3">
					<button type="button" className="h-12 rounded-xl border border-white/20 bg-white/[0.04] text-white/80 transition hover:bg-white/10" aria-label="Đăng nhập với Google"><GoogleIcon /></button>
					<button type="button" className="h-12 rounded-xl border border-white/20 bg-white/[0.04] text-white/80 transition hover:bg-white/10" aria-label="Đăng nhập với GitHub"><GithubIcon /></button>
					<button type="button" className="h-12 rounded-xl border border-white/20 bg-white/[0.04] text-white/80 transition hover:bg-white/10" aria-label="Đăng nhập với LinkedIn"><LinkedinIcon /></button>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
