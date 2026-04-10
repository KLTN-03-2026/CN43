// Fallback authentication UI handlers when app.js fails to initialize.
(function () {
    function createToast() {
        let el = document.getElementById("toast");
        if (!el) {
            el = document.createElement("div");
            el.id = "toast";
            el.style.position = "fixed";
            el.style.bottom = "1rem";
            el.style.left = "50%";
            el.style.transform = "translateX(-50%)";
            el.style.zIndex = "9999";
            el.style.padding = "1rem 1.25rem";
            el.style.borderRadius = "1rem";
            el.style.background = "rgba(0, 0, 0, 0.85)";
            el.style.color = "#fff";
            el.style.maxWidth = "90vw";
            el.style.boxShadow = "0 16px 32px rgba(0,0,0,0.35)";
            el.style.display = "none";
            document.body.appendChild(el);
        }
        return el;
    }

    function showToast(message, isError = false) {
        const el = createToast();
        el.textContent = message || "Da xay ra loi";
        el.style.background = isError ? "rgba(183, 28, 28, 0.95)" : "rgba(0, 0, 0, 0.85)";
        el.style.display = "block";
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
            el.style.display = "none";
        }, 3500);
    }

    function showGuestStep(step) {
        const steps = {
            choice: document.getElementById("guest-choice"),
            login: document.getElementById("guest-login"),
            register: document.getElementById("guest-register"),
            verify: document.getElementById("guest-verify"),
        };

        Object.entries(steps).forEach(([name, el]) => {
            if (!el) return;
            el.classList.toggle("hidden", name !== step);
        });
    }

    function parseResponse(response) {
        return response.text().then((text) => {
            try {
                return text ? JSON.parse(text) : null;
            } catch {
                return { detail: text || response.statusText };
            }
        });
    }

    function goToVerify(email) {
        const normalizedEmail = String(email || "").trim();
        if (normalizedEmail) {
            sessionStorage.setItem("pending_verification_email", normalizedEmail);
        }

        if (typeof router !== "undefined" && router && typeof router.navigate === "function") {
            router.navigate("/verify", { force: true });
            setTimeout(() => {
                const emailInput = document.getElementById("verify-email");
                const otpInput = document.getElementById("verify-otp");
                if (emailInput && normalizedEmail) {
                    emailInput.value = normalizedEmail;
                }
                if (otpInput) {
                    otpInput.focus();
                }
            }, 0);
            return;
        }

        if (typeof renderVerifyPage === "function") {
            renderVerifyPage();
        }

        document.getElementById("verify-email")?.setAttribute("value", normalizedEmail);
        const emailLabel = document.getElementById("verify-email-label");
        if (emailLabel) emailLabel.textContent = normalizedEmail;
        showGuestStep("verify");
        setTimeout(() => {
            document.querySelector("[data-otp-digit]")?.focus();
        }, 0);
    }

    function attachVerificationFormEnhancements() {
        const otpInputs = Array.from(document.querySelectorAll("[data-otp-digit]"));
        const hiddenOtpInput = document.getElementById("verify-otp");

        if (!otpInputs.length || !hiddenOtpInput) {
            return;
        }

        const syncOtpValue = () => {
            hiddenOtpInput.value = otpInputs.map((input) => input.value.replace(/\D/g, "")).join("");
        };

        const focusInput = (index) => {
            const nextInput = otpInputs[index];
            if (!nextInput) return;
            window.requestAnimationFrame(() => {
                nextInput.focus({ preventScroll: true });
                if (typeof nextInput.select === "function") {
                    nextInput.select();
                }
            });
        };

        const setDigit = (index, value) => {
            if (!otpInputs[index]) return;
            otpInputs[index].value = value;
        };

        const fillDigitsFrom = (startIndex, rawValue) => {
            const digits = String(rawValue || "").replace(/\D/g, "").slice(0, otpInputs.length - startIndex);
            if (!digits) return;

            digits.split("").forEach((digit, offset) => {
                setDigit(startIndex + offset, digit);
            });

            syncOtpValue();
            focusInput(Math.min(startIndex + digits.length, otpInputs.length - 1));
        };

        otpInputs.forEach((input, index) => {
            input.setAttribute("inputmode", "numeric");
            input.setAttribute("pattern", "[0-9]*");
            input.maxLength = 1;

            input.addEventListener("focus", () => {
                if (typeof input.select === "function") {
                    input.select();
                }
            });

            input.addEventListener("input", (event) => {
                const currentValue = String(event.target.value || "");
                const digits = currentValue.replace(/\D/g, "");

                if (!digits) {
                    setDigit(index, "");
                    syncOtpValue();
                    return;
                }

                if (digits.length > 1) {
                    fillDigitsFrom(index, digits);
                    return;
                }

                setDigit(index, digits);
                syncOtpValue();
                if (index < otpInputs.length - 1) {
                    focusInput(index + 1);
                }
            });

            input.addEventListener("keydown", (event) => {
                if (event.key === "Backspace" && !input.value && index > 0) {
                    event.preventDefault();
                    setDigit(index - 1, "");
                    syncOtpValue();
                    focusInput(index - 1);
                    return;
                }

                if (event.key === "ArrowLeft" && index > 0) {
                    event.preventDefault();
                    focusInput(index - 1);
                    return;
                }

                if (event.key === "ArrowRight" && index < otpInputs.length - 1) {
                    event.preventDefault();
                    focusInput(index + 1);
                }
            });

            input.addEventListener("paste", (event) => {
                event.preventDefault();
                fillDigitsFrom(index, event.clipboardData?.getData("text") || "");
            });
        });

        hiddenOtpInput.value = "";
        focusInput(0);
    }

    async function submitLogin(event) {
        event.preventDefault();
        const form = event.target;
        const email = String(form.email?.value || "").trim();
        const password = String(form.password?.value || "").trim();
        if (!email || !password) {
            showToast("Vui long nhap email va mat khau", true);
            return;
        }

        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username: email, password }),
            });
            const data = await parseResponse(response);
            if (!response.ok) {
                throw new Error(data?.detail || response.statusText);
            }
            localStorage.setItem("jp_token", data.access_token || "");
            showToast("Dang nhap thanh cong");
            if (typeof router !== "undefined" && router && typeof router.navigate === "function") {
                router.navigate("/home", { replace: true, force: true });
            } else {
                window.location.href = "/";
            }
        } catch (error) {
            showToast(error.message || "Dang nhap that bai", true);
        }
    }

    async function submitRegister(event) {
        event.preventDefault();
        const form = event.target;
        const full_name = String(form.full_name?.value || "").trim();
        const email = String(form.email?.value || "").trim();
        const password = String(form.password?.value || "").trim();
        const password_confirm = String(form.password_confirm?.value || "").trim();
        const role = String(form.role?.value || "candidate").trim();

        if (!full_name || !email || !password || !password_confirm) {
            showToast("Vui long nhap day du thong tin dang ky", true);
            return;
        }
        if (password !== password_confirm) {
            showToast("Mat khau xac nhan khong khop", true);
            return;
        }

        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ full_name, email, password, role }),
            });
            const data = await parseResponse(response);
            if (!response.ok) {
                throw new Error(data?.detail || response.statusText);
            }
            const debugMessage = data?.debug_otp ? ` Ma OTP test: ${data.debug_otp}` : "";
            showToast((data?.message || "Dang ky thanh cong. Vui long nhap OTP de xac minh.") + debugMessage);
            goToVerify(email);
        } catch (error) {
            showToast(error.message || "Dang ky that bai", true);
        }
    }

    async function submitVerifyOtp(event) {
        event.preventDefault();
        const form = event.target;
        const email = String(form.email?.value || "").trim();
        const otp = String(form.otp?.value || "").trim();
        if (!email || !otp) {
            showToast("Vui long nhap email va ma OTP", true);
            return;
        }

        try {
            const response = await fetch("/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await parseResponse(response);
            if (!response.ok) {
                throw new Error(data?.detail || response.statusText);
            }
            showToast(data?.message || "Xac minh thanh cong");
            showGuestStep("login");
        } catch (error) {
            showToast(error.message || "Xac minh OTP that bai", true);
        }
    }

    async function resendOtp(event) {
        event.preventDefault();
        const email = String(document.getElementById("verify-email")?.value || "").trim();
        if (!email) {
            showToast("Khong tim thay email de gui lai OTP", true);
            return;
        }
        try {
            const response = await fetch("/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await parseResponse(response);
            if (!response.ok) {
                throw new Error(data?.detail || response.statusText);
            }
            const debugMessage = data?.debug_otp ? ` Ma OTP test: ${data.debug_otp}` : "";
            showToast((data?.message || "OTP moi da duoc gui") + debugMessage);
        } catch (error) {
            showToast(error.message || "Gui lai OTP that bai", true);
        }
    }

    function init() {
        document.getElementById("btn-go-login")?.addEventListener("click", () => showGuestStep("login"));
        document.getElementById("btn-go-register")?.addEventListener("click", () => showGuestStep("register"));
        document.getElementById("guest-back-from-login")?.addEventListener("click", () => showGuestStep("choice"));
        document.getElementById("guest-back-from-register")?.addEventListener("click", () => showGuestStep("choice"));
        document.getElementById("guest-back-from-verify")?.addEventListener("click", () => showGuestStep("register"));
        document.getElementById("link-login-to-register")?.addEventListener("click", () => showGuestStep("register"));
        document.getElementById("link-register-to-login")?.addEventListener("click", () => showGuestStep("login"));
        document.getElementById("form-login")?.addEventListener("submit", submitLogin);
        document.getElementById("form-register")?.addEventListener("submit", submitRegister);
        document.getElementById("form-verify-otp")?.addEventListener("submit", submitVerifyOtp);
        document.getElementById("btn-resend-otp")?.addEventListener("click", resendOtp);
        if (typeof bindPasswordToggles === "function") {
            bindPasswordToggles();
        }
    }

    window.attachVerificationFormEnhancements = attachVerificationFormEnhancements;

    document.addEventListener("DOMContentLoaded", init);
})();
