import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const LoginForm = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, isLoading } = useAuth();
	const { showToast } = useToast();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
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
		<div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
			<div className="grid w-full overflow-hidden rounded-[28px] bg-[#f5f5f7] shadow-[0_30px_80px_rgba(30,38,68,0.18)] lg:grid-cols-[1fr_1.05fr]">
				<section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
					<div className="w-full max-w-[360px]">
						<img
							src="/static/logo/hotcv-icon.svg"
							alt="HOT CV icon"
							className="h-14 w-14"
						/>

						<h1 className="mt-7 text-[34px] font-extrabold leading-tight text-[#1f1f26]">
							Welcome Back!
						</h1>
						<p className="mt-2 text-sm text-[#70707b]">Please enter your details</p>

						<form onSubmit={handleSubmit} className="mt-9 space-y-5">
							<div className="space-y-2">
								<label htmlFor="login-email" className="text-sm font-semibold text-[#27272f]">
									Email Address
								</label>
								<input
									id="login-email"
									type="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									autoComplete="email"
									placeholder="you@example.com"
									className="h-12 w-full rounded-[10px] border border-[#dfdfeb] bg-white px-4 text-[15px] text-[#18181f] outline-none transition focus:border-[#5a4ff3] focus:ring-4 focus:ring-[#5a4ff3]/15"
									required
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="login-password" className="text-sm font-semibold text-[#27272f]">
									Password
								</label>
								<input
									id="login-password"
									type="password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									autoComplete="current-password"
									placeholder="Enter your password"
									className="h-12 w-full rounded-[10px] border border-[#dfdfeb] bg-white px-4 text-[15px] text-[#18181f] outline-none transition focus:border-[#5a4ff3] focus:ring-4 focus:ring-[#5a4ff3]/15"
									required
								/>
							</div>

							<div className="flex items-center justify-between gap-3 pt-0.5 text-sm">
								<label className="inline-flex items-center gap-2 text-[#6d6d79]">
									<input
										type="checkbox"
										checked={rememberMe}
										onChange={(event) => setRememberMe(event.target.checked)}
										className="h-4 w-4 rounded border-[#c8c8d7] text-[#5a4ff3] focus:ring-[#5a4ff3]/30"
									/>
									Remember me
								</label>
								<button type="button" className="font-medium text-[#6767f4] transition hover:text-[#4d4dd8]">
									Forgot Password?
								</button>
							</div>

							<button
								type="submit"
								disabled={Boolean(isLoading)}
								className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#4f46e5] px-4 text-sm font-semibold text-white transition hover:bg-[#443bda] disabled:cursor-not-allowed disabled:bg-[#9894de]"
							>
								{isLoading ? 'Logging in...' : 'Login'}
								<span aria-hidden="true">-&gt;</span>
							</button>
						</form>

						<p className="mt-6 text-xs leading-6 text-[#71717f]">
							By creating an account, you agree to our
							{' '}
							<a href="#" className="font-semibold text-[#31313d] hover:text-[#111116]">Terms of Service</a>
							{' '}
							and
							{' '}
							<a href="#" className="font-semibold text-[#31313d] hover:text-[#111116]">Privacy Policy</a>
						</p>

						<p className="mt-6 text-center text-sm text-[#666674]">
							Don&apos;t have an account?
							{' '}
							<Link to="/register" state={registerState} className="font-semibold text-[#4f46e5] transition hover:text-[#3f37cc]">
								Sign Up
							</Link>
						</p>
					</div>
				</section>

				<section className="login-hero relative hidden min-h-[680px] overflow-hidden p-5 lg:block">
					<div className="relative h-full rounded-[30px] border border-white/25 bg-white/8 p-7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-[2px]">
						<div className="absolute left-1/2 top-10 h-16 w-16 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#2f2f3f] to-[#0f0f16] shadow-[0_18px_35px_rgba(0,0,0,0.55)]" />
						<div className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 bg-white/50" />

						<div className="absolute inset-x-8 top-16 h-[1px] bg-white/20" />
						<div className="absolute inset-x-8 top-40 h-[1px] bg-white/20" />
						<div className="absolute inset-x-8 top-64 h-[1px] bg-white/20" />

						<div className="absolute bottom-40 left-12 right-12">
							<div className="relative mx-auto h-[300px] w-[340px]">
								<div className="absolute bottom-0 h-[210px] w-[340px] rounded-[999px] bg-[#1f2130]/90 shadow-[0_28px_44px_rgba(15,17,33,0.55)]" />
								<div className="login-float absolute bottom-[120px] left-[88px] h-28 w-28 rounded-[28px] bg-gradient-to-br from-[#3a3d4f] to-[#1a1c29] shadow-[0_20px_28px_rgba(18,21,40,0.4)]" />
								<div className="absolute bottom-[102px] left-[155px] h-20 w-28 rounded-[14px] border border-white/20 bg-gradient-to-br from-[#eef0ff] to-[#ccd0f9] shadow-[0_10px_22px_rgba(96,109,196,0.35)]" />
							</div>
						</div>

						<div className="absolute inset-x-8 bottom-8">
							<p className="text-[36px] font-extrabold leading-tight tracking-tight text-white/95">
								Seamless work experience
							</p>
							<p className="mt-3 max-w-sm text-base text-white/80">
								Everything you need in one clean, customizable dashboard.
							</p>

							<div className="mt-8 flex items-center justify-center gap-2.5">
								<span className="h-2.5 w-8 rounded-full bg-white/95" />
								<span className="h-2.5 w-2.5 rounded-full bg-white/60" />
								<span className="h-2.5 w-2.5 rounded-full bg-white/30" />
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default LoginForm;
