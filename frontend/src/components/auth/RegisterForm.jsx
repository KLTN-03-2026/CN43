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

export const RegisterForm = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { register, isLoading } = useAuth();
	const { showToast } = useToast();
	const [email, setEmail] = useState('');
	const [fullName, setFullName] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [role, setRole] = useState('candidate');

	const backToLoginState = { from: location.state?.from || '/' };

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!email || !fullName || !password) {
			showToast('Vui lòng nhập đầy đủ thông tin', true);
			return;
		}

		try {
			const response = await register({ email: email.trim(), full_name: fullName.trim(), password, role });
			showToast(response?.message || 'Đăng ký thành công. Vui lòng xác minh email.');
			navigate('/verify', { replace: true, state: { email: response?.email || email.trim() } });
		} catch (error) {
			showToast(error?.message || 'Đăng ký thất bại', true);
		}
	};

	return (
		<div className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] w-full items-center justify-center overflow-hidden bg-[#0d0d0d] px-4 py-8 sm:px-6">

			<div className="relative z-10 w-full max-w-[460px] rounded-[28px] border border-white/15 bg-gradient-to-b from-[#1b1e2a]/90 to-[#131621]/90 p-7 shadow-[0_24px_90px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-9">
				<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
					<img src="/static/logo/hotcv-icon.svg" alt="HOT CV icon" className="h-14 w-14" />
				</div>

				<h1 className="mt-7 text-center text-5xl font-extrabold leading-none tracking-tight text-white sm:text-6xl">
					Đăng Ký
				</h1>
				<p className="mt-3 text-center text-base text-white/65 sm:text-lg">
					Đã có tài khoản?{' '}
					<Link to="/login" state={backToLoginState} className="font-semibold text-red-500 transition hover:text-red-400">
						Đăng nhập ngay
					</Link>
				</p>

				<form onSubmit={handleSubmit} className="mt-8 space-y-4">
					<input
						id="register-name"
						type="text"
						value={fullName}
						onChange={(event) => setFullName(event.target.value)}
						placeholder="Họ và tên"
						className="h-14 w-full rounded-xl border border-white/20 bg-white/[0.04] px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-red-400/80 focus:ring-4 focus:ring-red-500/15"
						required
					/>

					<input
						id="register-email"
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
							id="register-password"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							autoComplete="new-password"
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

					<select
						id="register-role"
						value={role}
						onChange={(event) => setRole(event.target.value)}
						className="h-14 w-full rounded-xl border border-white/20 bg-white/[0.04] px-4 text-base text-white outline-none transition focus:border-red-400/80 focus:ring-4 focus:ring-red-500/15"
					>
						<option value="candidate" className="bg-[#10121a]">Ứng viên</option>
						<option value="employer" className="bg-[#10121a]">Nhà tuyển dụng</option>
					</select>

					<button
						type="submit"
						disabled={Boolean(isLoading)}
						className="mt-2 flex h-14 w-full items-center justify-center rounded-xl bg-[#ef1f2d] text-xl font-bold text-white shadow-[0_12px_35px_rgba(239,31,45,0.45)] transition hover:bg-[#ff2b3a] disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isLoading ? 'Đang tạo tài khoản...' : 'Đăng Ký'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default RegisterForm;
