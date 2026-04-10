// Note: token is already declared in api.js
// Note: user is declared in common/js/api.js
let pendingVerificationEmail = sessionStorage.getItem("pending_verification_email") || "";
let pendingVerificationPassword = "";

function showToast(message, isError = false) {
  const safeMessage = String(message || "Có lỗi xảy ra");
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = safeMessage;
  el.className = isError ? "toast error" : "toast";
  el.style.display = "block";
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    el.style.display = "none";
  }, 3500);
}

function parseDetail(data) {
  if (!data) return "Lỗi không xác định";
  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => item.msg || JSON.stringify(item)).join("; ");
  }
  return JSON.stringify(data);
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }
  const response = await fetch(path.startsWith("/") ? path : API + path, { ...options, headers });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text || response.statusText };
  }
  if (!response.ok) {
    throw new Error(parseDetail(data) || response.statusText);
  }
  return data;
}

function setAuth(nextToken, nextUser) {
  token = nextToken || "";
  user = nextUser || null;
  if (token) {
    localStorage.setItem("jp_token", token);
  } else {
    localStorage.removeItem("jp_token");
  }
}

function showGuestStep(step) {
  const choice = document.getElementById("guest-choice");
  const login = document.getElementById("guest-login");
  const register = document.getElementById("guest-register");
  const verify = document.getElementById("guest-verify");
  if (!choice || !login || !register || !verify) return;
  choice.classList.toggle("hidden", step !== "choice");
  login.classList.toggle("hidden", step !== "login");
  register.classList.toggle("hidden", step !== "register");
  verify.classList.toggle("hidden", step !== "verify");
}

function setPendingVerificationEmail(email) {
  pendingVerificationEmail = String(email || "").trim();
  if (pendingVerificationEmail) {
    sessionStorage.setItem("pending_verification_email", pendingVerificationEmail);
  } else {
    sessionStorage.removeItem("pending_verification_email");
  }
  const emailInput = document.getElementById("verify-email");
  const emailLabel = document.getElementById("verify-email-label");
  if (emailInput) emailInput.value = pendingVerificationEmail;
  if (emailLabel) emailLabel.textContent = pendingVerificationEmail || "email của bạn";
}

function updateVerifyDebugNote(message) {
  const note = document.getElementById("verify-debug-otp");
  if (!note) return;
  if (message) {
    note.textContent = message;
    note.classList.remove("hidden");
  } else {
    note.textContent = "";
    note.classList.add("hidden");
  }
}

function updateRegisterDebugNote(message) {
  const note = document.getElementById("register-debug-otp");
  if (!note) return;
  if (message) {
    note.textContent = message;
    note.classList.remove("hidden");
  } else {
    note.textContent = "";
    note.classList.add("hidden");
  }
}

async function loginWithCredentials(email, password) {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text || response.statusText };
  }
  if (!response.ok) {
    throw new Error(parseDetail(data));
  }
  return data;
}

async function fetchMe() {
  if (!token) return null;
  try {
    return await api("/auth/me");
  } catch {
    return null;
  }
}

async function login(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  if (!email || !password) {
    showToast("Vui lòng nhập email và mật khẩu", true);
    return;
  }
  try {
    const data = await loginWithCredentials(email, password);
    setAuth(data.access_token, null);
    user = await fetchMe();
    if (!user) {
      setAuth("", null);
      throw new Error("Không lấy được thông tin tài khoản");
    }
    showToast("Đăng nhập thành công");

    // Prefer client-side routing and force re-render; fallback to full navigation.
    if (router) {
      router.navigate(ROUTES.HOME, { replace: true, force: true });
      return;
    }
    window.location.href = "/home";
  } catch (error) {
    showToast(error.message || "Đăng nhập thất bại", true);
  }
}

async function register(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const full_name = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const password_confirm = String(formData.get("password_confirm") || "").trim();
  const role = String(formData.get("role") || "candidate").trim();
  if (!full_name || !email || !password || !password_confirm) {
    showToast("Vui lòng nhập đầy đủ thông tin đăng ký", true);
    return;
  }
  if (password !== password_confirm) {
    showToast("Mật khẩu xác nhận không khớp", true);
    return;
  }
  try {
    const data = await api("/auth/register", {
      method: "POST",
      body: { full_name, email, password, role },
    });
    setPendingVerificationEmail(email);
    pendingVerificationPassword = password;
    const debugMessage = data.debug_otp ? `Mã OTP test: ${data.debug_otp}` : "";
    updateRegisterDebugNote(debugMessage);
    updateVerifyDebugNote(debugMessage);
    showToast((data.message || "Đã gửi mã OTP") + (debugMessage ? ` ${debugMessage}` : ""));
    event.target.reset();
    navigateTo("/verify");
  } catch (error) {
    showToast(error.message || "Đăng ký thất bại", true);
  }
}

async function verifyOtp(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = String(formData.get("email") || "").trim();
  const otp = String(formData.get("otp") || "").trim();
  if (!email || !otp) {
    showToast("Vui lòng nhập email và mã OTP", true);
    return;
  }
  try {
    const data = await api("/auth/verify-otp", {
      method: "POST",
      body: { email, otp },
    });
    updateVerifyDebugNote("");
    setPendingVerificationEmail("");
    event.target.reset();
    showToast(data.message || "Xác minh thành công");
    navigateTo("/login");
  } catch (error) {
    showToast(error.message || "Xác minh OTP thất bại", true);
  }
}

async function resendOtp() {
  if (!pendingVerificationEmail) {
    showToast("Không tìm thấy email cần gửi lại OTP", true);
    return;
  }
  try {
    const data = await api("/auth/resend-otp", {
      method: "POST",
      body: { email: pendingVerificationEmail },
    });
    const debugMessage = data.debug_otp ? `Mã OTP test: ${data.debug_otp}` : "";
    updateVerifyDebugNote(debugMessage);
    showToast((data.message || "OTP mới đã được gửi") + (debugMessage ? ` ${debugMessage}` : ""));
    navigateTo("/verify");
  } catch (error) {
    showToast(error.message || "Gửi lại OTP thất bại", true);
  }
}

function logout() {
  setAuth("", null);
  user = null;
  if (router) {
    router.navigate(ROUTES.LOGIN, { replace: true });
  }
  showToast("Đã đăng xuất");
}

// Old functions kept for backwards compatibility (implemented using new router)
function showGuestStep(step) {
  // Handled by new router system
  const stepMap = {
    choice: ROUTES.HOME,
    login: ROUTES.LOGIN,
    register: ROUTES.REGISTER,
    verify: ROUTES.VERIFY,
  };
  if (router && stepMap[step]) {
    router.navigate(stepMap[step]);
  }
}

function normalizeRoute(pathname = window.location.pathname) {
  if (!pathname || pathname === "") return "/home";
  if (pathname === "/") return "/home";
  return pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
}

function navigateTo(path, { replace = false, force = false } = {}) {
  // Use new router if available, otherwise use old method
  if (router) {
    router.navigate(path, { replace, force });
  } else {
    // Fallback for backwards compatibility
    const target = normalizeRoute(path);
    if (replace) {
      window.history.replaceState({}, "", target);
    } else {
      window.history.pushState({}, "", target);
    }

    if (force) {
      window.location.href = target;
    }
  }
}

function renderAuth() {
  // Handled by new router system - kept for backwards compatibility
  if (router) {
    router.render(router.getCurrentRoute());
  }
}

function bindPasswordToggles() {
  document.querySelectorAll(".pwd-toggle").forEach((button) => {
    button.removeEventListener("click", togglePasswordVisibility);
    button.addEventListener("click", togglePasswordVisibility);
  });
}

function togglePasswordVisibility(event) {
  const targetId = event.currentTarget.getAttribute("data-target");
  const input = document.getElementById(targetId);
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
}

