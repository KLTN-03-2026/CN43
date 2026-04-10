import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const RegisterForm = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { register, isLoading } = useAuth();
	const { showToast } = useToast();
	const [email, setEmail] = useState('');
	const [fullName, setFullName] = useState('');
	const [password, setPassword] = useState('');
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
		<div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
			<div className="grid w-full overflow-hidden rounded-[28px] bg-[#f5f5f7] shadow-[0_30px_80px_rgba(30,38,68,0.18)] lg:grid-cols-[1fr_1.05fr]">
				<section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
					<div className="w-full max-w-[360px]">
						<h1 className="mt-0 text-[34px] font-extrabold leading-tight text-[#1f1f26]">Create account</h1>
						<p className="mt-2 text-sm text-[#70707b]">Tạo tài khoản để tiếp tục</p>

						<form onSubmit={handleSubmit} className="mt-9 space-y-5">
							<div className="space-y-2">
								<label htmlFor="register-name" className="text-sm font-semibold text-[#27272f]">Full name</label>
								<input id="register-name" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nguyen Van A" className="h-12 w-full rounded-[10px] border border-[#dfdfeb] bg-white px-4 text-[15px] text-[#18181f] outline-none transition focus:border-[#5a4ff3] focus:ring-4 focus:ring-[#5a4ff3]/15" required />
							</div>

							<div className="space-y-2">
								<label htmlFor="register-email" className="text-sm font-semibold text-[#27272f]">Email Address</label>
								<input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="h-12 w-full rounded-[10px] border border-[#dfdfeb] bg-white px-4 text-[15px] text-[#18181f] outline-none transition focus:border-[#5a4ff3] focus:ring-4 focus:ring-[#5a4ff3]/15" required />
							</div>

							<div className="space-y-2">
								<label htmlFor="register-password" className="text-sm font-semibold text-[#27272f]">Password</label>
								<input id="register-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="Enter your password" className="h-12 w-full rounded-[10px] border border-[#dfdfeb] bg-white px-4 text-[15px] text-[#18181f] outline-none transition focus:border-[#5a4ff3] focus:ring-4 focus:ring-[#5a4ff3]/15" required />
							</div>

							<div className="space-y-2">
								<label htmlFor="register-role" className="text-sm font-semibold text-[#27272f]">Account type</label>
								<select id="register-role" value={role} onChange={(event) => setRole(event.target.value)} className="h-12 w-full rounded-[10px] border border-[#dfdfeb] bg-white px-4 text-[15px] text-[#18181f] outline-none transition focus:border-[#5a4ff3] focus:ring-4 focus:ring-[#5a4ff3]/15">
									<option value="candidate">Candidate</option>
									<option value="employer">Employer</option>
								</select>
							</div>

							<button type="submit" disabled={Boolean(isLoading)} className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#4f46e5] px-4 text-sm font-semibold text-white transition hover:bg-[#443bda] disabled:cursor-not-allowed disabled:bg-[#9894de]">
								{isLoading ? 'Creating...' : 'Register'}
							</button>
						</form>

						<p className="mt-6 text-center text-sm text-[#666674]">
							Already have an account?{' '}
							<Link to="/login" state={backToLoginState} className="font-semibold text-[#4f46e5] transition hover:text-[#3f37cc]">
								Sign In
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
						<div className="absolute inset-x-8 bottom-8">
							<p className="text-[36px] font-extrabold leading-tight tracking-tight text-white/95">Join the platform</p>
							<p className="mt-3 max-w-sm text-base text-white/80">Đăng ký xong, bạn sẽ được đưa sang trang xác minh và sau đó quay về giao diện chính.</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default RegisterForm;
