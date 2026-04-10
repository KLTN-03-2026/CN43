import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { post } from '../../services/api';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export const VerificationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verify, isLoading } = useAuth();
  const { showToast } = useToast();
  const inputRefs = useRef([]);
  const routeEmail = String(location.state?.email || '').trim();
  const [email, setEmail] = useState(
    routeEmail || sessionStorage.getItem('pending_verification_email') || ''
  );
  const [otpDigits, setOtpDigits] = useState(() => Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const otp = otpDigits.join('');
  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, start, middle, domain) => {
        const visibleMiddle = middle.length > 2 ? `${middle.slice(0, 2)}${'*'.repeat(Math.max(middle.length - 2, 0))}` : middle;
        return `${start}${visibleMiddle}${domain}`;
      })
    : 'your@email.com';

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!routeEmail) return;
    sessionStorage.setItem('pending_verification_email', routeEmail);
    setEmail(routeEmail);
  }, [routeEmail]);

  const focusOtpInput = (index) => {
    const nextInput = inputRefs.current[index];
    if (!nextInput) return;

    window.requestAnimationFrame(() => {
      nextInput.focus({ preventScroll: true });
    });
  };

  const setDigitAtIndex = (index, value) => {
    setOtpDigits((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const handleOtpChange = (index, rawValue) => {
    const cleanedValue = rawValue.replace(/\D/g, '');

    if (!cleanedValue) {
      setDigitAtIndex(index, '');
      return;
    }

    if (cleanedValue.length > 1) {
      const nextDigits = Array(OTP_LENGTH).fill('');
      cleanedValue
        .slice(0, OTP_LENGTH)
        .split('')
        .forEach((digit, digitIndex) => {
          nextDigits[digitIndex] = digit;
        });
      setOtpDigits(nextDigits);
      const nextFocusIndex = Math.min(cleanedValue.length, OTP_LENGTH - 1);
      focusOtpInput(nextFocusIndex);
      return;
    }

    setDigitAtIndex(index, cleanedValue);
    if (index < OTP_LENGTH - 1) {
      focusOtpInput(index + 1);
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigitAtIndex(index - 1, '');
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pastedValue) return;

    const nextDigits = Array(OTP_LENGTH).fill('');
    pastedValue.split('').forEach((digit, index) => {
      nextDigits[index] = digit;
    });
    setOtpDigits(nextDigits);
    focusOtpInput(Math.min(pastedValue.length, OTP_LENGTH) - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || otp.length !== OTP_LENGTH) {
      showToast('Vui lòng nhập đầy đủ email và mã OTP', true);
      return;
    }

    try {
      await verify(email, otp);
      sessionStorage.removeItem('pending_verification_email');
      showToast('Xác minh thành công. Đang chuyển sang trang đăng nhập...');
      window.setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      showToast(error.message || 'Xác minh OTP thất bại', true);
    }
  };

  const handleResendOtp = async () => {
    if (secondsLeft > 0 || !email) return;

    try {
      const response = await post('/auth/resend-otp', { email });
      const debugMessage = response?.debug_otp ? ` Mã OTP test: ${response.debug_otp}` : '';
      setSecondsLeft(RESEND_SECONDS);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      showToast((response?.message || 'OTP mới đã được gửi') + debugMessage);
    } catch (error) {
      showToast(error.message || 'Gửi lại OTP thất bại', true);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-16rem)] max-w-3xl items-center justify-center py-10">
      <div className="w-full max-w-2xl rounded-[36px] border border-white/8 bg-white/[0.03] px-6 py-10 shadow-panel-soft backdrop-blur sm:px-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
            OTP Verification
          </p>
          <h1 className="mt-5 text-3xl font-black text-white sm:text-5xl">
            Verify your Email
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
            Enter the code we&apos;ve sent to your inbox
            {' '}
            <span className="font-medium text-white/75">{maskedEmail}</span>
          </p>

          {email ? (
            <p className="mt-1 text-sm text-white/55">
              Didn&apos;t get the code?
              {' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={secondsLeft > 0}
                className="font-semibold text-[#ff5a7a] transition hover:text-[#ff7f98] disabled:cursor-not-allowed disabled:text-white/30"
              >
                {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend it'}
              </button>
            </p>
          ) : (
            <div className="mx-auto mt-4 max-w-md text-left">
              <label
                htmlFor="verify-email"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-white/40"
              >
                Verification Email
              </label>
              <input
                id="verify-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="form-input h-12 rounded-2xl border-white/10 bg-black/35"
                placeholder="your@email.com"
                required
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10">
            <div className="grid grid-cols-6 gap-2 sm:gap-4">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  value={digit}
                  onInput={(event) => handleOtpChange(index, event.currentTarget.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  onPaste={handleOtpPaste}
                  onFocus={(event) => event.currentTarget.select()}
                  className="h-14 rounded-[18px] border border-white/6 bg-white/[0.06] text-center text-xl font-black text-white outline-none transition focus:border-[#ff5a7a] focus:bg-white/[0.1] focus:ring-2 focus:ring-[#ff5a7a]/35 sm:h-20 sm:text-3xl"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== OTP_LENGTH}
              className="mt-6 w-full rounded-[18px] bg-[#b8b8b8] px-5 py-4 text-sm font-semibold text-[#141414] transition hover:bg-[#d0d0d0] disabled:cursor-not-allowed disabled:bg-[#727272] disabled:text-white/65"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>

            <Link
              to="/register"
              className="mt-5 inline-flex items-center justify-center text-sm font-medium text-white/45 transition hover:text-white/70"
            >
              Back to register
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
