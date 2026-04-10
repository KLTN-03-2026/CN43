/**
 * Page Templates and Renderers
 * Each page function renders its content
 * Follows clean architecture: pure rendering functions
 */

/**
 * Home/Landing Page - Main job search interface
 */
function renderHomePage() {
    try {
        const main = document.querySelector("main.layout");
        if (!main) {
            console.error("Main layout element not found");
            return;
        }

        // Check if components are available
        if (!heroBanner) {
            console.error("heroBanner component not found");
            main.innerHTML = "<p class='text-red-500'>Error: Hero banner component not loaded</p>";
            return;
        }
        
        if (!searchBar) {
            console.error("searchBar component not found");
            main.innerHTML = "<p class='text-red-500'>Error: Search bar component not loaded</p>";
            return;
        }

        const state = {
            isAuthenticated: !!token && !!user,
            user: user,
        };

        const heroContent = heroBanner.render({
            title: "Việc làm IT tốt nhất cho bạn",
            subtitle: "Tìm đúng việc với bộ lọc nhanh chóng. Quản lý hồ sơ ứng tuyển dễ dàng.",
        });

        const searchContent = searchBar.render({
            locations: ["Tất cả thành phố", "Hà Nội", "TP.HCM", "Đà Nẵng", "Huế"],
            tags: ["Java", "ReactJS", ".NET", "NodeJS", "Python", "Go", "Rust"],
            onSearch: "handleJobSearch",
        });

        main.innerHTML = `
    <div class="home-container">
      ${heroContent}
      ${searchContent}

      <!-- Featured Companies Section -->
      <section class="featured-companies mb-16">
        <h2 class="text-2xl font-bold text-white mb-8">Công ty hàng đầu đang tuyển dụng</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${renderCompanyCard("Rakuten", "Java, iOS, Android, SQL", "2 Jobs", "Ho Chi Minh")}
          ${renderCompanyCard("ONE Tech Stop", "Backend, Frontend, DevOps", "6 Jobs", "Da Nang")}
          ${renderCompanyCard("NAVER Vietnam", "JavaScript, React, Java", "3 Jobs", "Ho Chi Minh")}
        </div>
      </section>

      <!-- Featured Jobs Section -->
      <section class="featured-jobs mb-16">
        <h2 class="text-2xl font-bold text-white mb-8">Việc làm nổi bật</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ${renderJobCardFull("Senior Backend Developer", "Rakuten", "Hà Nội", "3000-4500", "Build scalable backend systems")}
          ${renderJobCardFull("Frontend Developer", "ONE Tech Stop", "TP.HCM", "2500-3500", "Create amazing user experiences")}
          ${renderJobCardFull("DevOps Engineer", "NAVER", "Đà Nẵng", "3500-5000", "Manage cloud infrastructure")}
          ${renderJobCardFull("Full Stack Developer", "Tech Startup", "Hà Nội", "2000-3000", "Build web applications")}
        </div>
      </section>

      <!-- IT Skills Demand Section -->
      <section class="it-skills mb-16">
        <h2 class="text-2xl font-bold text-white mb-8">Kỹ năng IT đang cần tuyển</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${renderSkillTag("Backend Development", "150+ jobs")}
          ${renderSkillTag("Frontend Development", "120+ jobs")}
          ${renderSkillTag("DevOps & Cloud", "80+ jobs")}
          ${renderSkillTag("Data Engineer", "60+ jobs")}
          ${renderSkillTag("Mobile Development", "45+ jobs")}
          ${renderSkillTag("QA/Testing", "55+ jobs")}
          ${renderSkillTag("System Design", "35+ jobs")}
          ${renderSkillTag("AI/ML", "70+ jobs")}
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section rounded-[20px] bg-gradient-to-r from-brand-accent/20 to-blue-500/20 border border-brand-accent/30 p-8 md:p-12 text-center mb-8">
        <h2 class="text-3xl font-bold text-white mb-4">Sẵn sàng tìm việc IT tiếp theo?</h2>
        <p class="text-white/70 mb-6 max-w-2xl mx-auto">
          Tham gia hàng ngàn ứng viên tìm được công việc mơ ước của họ. Dễ dàng, nhanh chóng, và hiệu quả.
        </p>
        <button 
          type="button" 
          class="btn btn-lg inline-flex items-center justify-center rounded-full bg-brand-accent px-8 py-3 text-lg font-semibold text-white shadow-red-glow transition hover:bg-[#cf141b]"
          onclick="router.navigate('/login')"
        >
          Bắt đầu ngay
        </button>
      </section>
    </div>
  `;

        // Attach event listeners
        console.log("Attaching home page listeners...");
        if (typeof attachHomePageListeners === 'function') {
            attachHomePageListeners();
        }
    } catch (error) {
        console.error("Error rendering home page:", error);
        const main = document.querySelector("main.layout");
        if (main) {
            main.innerHTML = `<div class="text-red-500 p-8"><h1>Error Loading Page</h1><p>${error.message}</p><pre>${error.stack}</pre></div>`;
        }
    }
}

/**
 * Login Page
 */
function renderLoginPage() {
  if (token && user) {
    router.navigate(ROUTES.HOME, { replace: true, force: true });
    return;
  }

    const main = document.querySelector("main.layout");
    if (!main) return;

    main.innerHTML = `
    <div class="auth-container max-w-md mx-auto py-12">
      <div class="auth-panel rounded-[20px] border border-white/10 bg-white/5 backdrop-blur p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full border border-white/20 bg-white/5 mb-4">
            <img 
              src="/static/logo/hotcv-dark.svg" 
              alt="HOT CV Logo" 
              class="w-20 h-auto"
            />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Đăng Nhập</h1>
          <p class="text-white/60">Chưa có tài khoản? <a href="javascript:router.navigate('/register')" class="text-brand-accent hover:underline font-semibold">Đăng ký ngay</a></p>
        </div>

        <!-- Login Form -->
        <form onsubmit="login(event)" class="space-y-4" id="login-form">
          <div class="form-group">
            <input 
              type="email" 
              id="login-email"
              name="email" 
              class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              placeholder="Địa chỉ email"
              required
            />
          </div>

          <div class="form-group">
            <div class="relative">
              <input 
                type="password" 
                id="login-password"
                name="password" 
                class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                placeholder="Mật khẩu"
                required
              />
              <button 
                type="button"
                class="pwd-toggle absolute right-3 top-3 text-white/60 hover:text-white"
                data-target="login-password"
              >
                👁️
              </button>
            </div>
          </div>

          <button 
            type="submit"
            class="w-full rounded-lg bg-brand-accent px-4 py-3 text-center font-bold text-white shadow-red-glow transition hover:bg-[#cf141b]"
          >
            Đăng Nhập
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-white/10"></div>
          <span class="text-sm text-white/50">hoặc</span>
          <div class="flex-1 h-px bg-white/10"></div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-3 gap-3">
          <button type="button" class="flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white font-semibold transition hover:bg-white/10">
            🍎
          </button>
          <button type="button" class="flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white font-semibold transition hover:bg-white/10">
            🔍
          </button>
          <button type="button" class="flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white font-semibold transition hover:bg-white/10">
            𝕏
          </button>
        </div>
      </div>
    </div>
  `;

    bindPasswordToggles();
}

/**
 * Register Page
 */
function renderRegisterPage() {
  if (token && user) {
    router.navigate(ROUTES.HOME, { replace: true, force: true });
    return;
  }

    const main = document.querySelector("main.layout");
    if (!main) return;

    main.innerHTML = `
    <div class="auth-container max-w-md mx-auto py-12">
      <div class="auth-panel rounded-[20px] border border-white/10 bg-white/5 backdrop-blur p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full border border-white/20 bg-white/5 mb-4">
            <img 
              src="/static/logo/hotcv-dark.svg" 
              alt="HOT CV Logo" 
              class="w-20 h-auto"
            />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Đăng Ký</h1>
          <p class="text-white/60">Đã có tài khoản? <a href="javascript:router.navigate('/login')" class="text-brand-accent hover:underline font-semibold">Đăng nhập</a></p>
        </div>

        <!-- Register Form -->
        <form onsubmit="register(event)" class="space-y-4" id="register-form">
          <div class="form-group">
            <input 
              type="text" 
              id="reg-name"
              name="full_name" 
              class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              placeholder="Họ và tên"
              required
            />
          </div>

          <div class="form-group">
            <input 
              type="email" 
              id="reg-email"
              name="email" 
              class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              placeholder="Địa chỉ email"
              required
            />
          </div>

          <div class="form-group">
            <select
              id="reg-role"
              name="role"
              class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              required
            >
              <option value="candidate">Ứng viên</option>
              <option value="employer">Nhà tuyển dụng</option>
            </select>
          </div>

          <div class="form-group">
            <div class="relative">
              <input 
                type="password" 
                id="reg-password"
                name="password" 
                class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                placeholder="Mật khẩu"
                required
              />
              <button 
                type="button"
                class="pwd-toggle absolute right-3 top-3 text-white/60 hover:text-white"
                data-target="reg-password"
              >
                👁️
              </button>
            </div>
          </div>

          <div class="form-group">
            <div class="relative">
              <input 
                type="password" 
                id="reg-password-confirm"
                name="password_confirm" 
                class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                placeholder="Xác nhận mật khẩu"
                required
              />
              <button 
                type="button"
                class="pwd-toggle absolute right-3 top-3 text-white/60 hover:text-white"
                data-target="reg-password-confirm"
              >
                👁️
              </button>
            </div>
          </div>

          <div class="form-group flex items-center gap-2">
            <input type="checkbox" id="reg-agree" name="agree" required class="rounded" />
            <label for="reg-agree" class="text-sm text-white/70">
              Tôi đồng ý với 
              <a href="#" class="text-brand-accent hover:underline">điều khoản dịch vụ</a>
            </label>
          </div>

          <button 
            type="submit"
            class="w-full rounded-lg bg-brand-accent px-4 py-3 text-center font-bold text-white shadow-red-glow transition hover:bg-[#cf141b]"
          >
            Đăng Ký
          </button>
        </form>

      </div>
    </div>
  `;

    bindPasswordToggles();
}

/**
 * Verify OTP Page
 */
function renderVerifyPage() {
  if (token && user) {
    router.navigate(ROUTES.HOME, { replace: true, force: true });
    return;
  }

    const main = document.querySelector("main.layout");
    if (!main) return;

    main.innerHTML = `
    <div class="auth-container max-w-md mx-auto py-12">
      <div class="auth-panel rounded-[20px] border border-white/10 bg-white/5 backdrop-blur p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-white mb-2">Xác minh Email</h1>
          <p class="text-white/60">Nhập mã OTP đã gửi tới email của bạn</p>
        </div>

        <!-- Verify Form -->
        <form onsubmit="verifyOtp(event)" class="space-y-5" id="verify-form">
          <div class="form-group">
            <label for="verify-email" class="block text-sm font-semibold text-white mb-2">Email</label>
            <input 
              type="email" 
              id="verify-email"
              name="email" 
              class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              placeholder="your@email.com"
              readonly
              value="${pendingVerificationEmail}"
              required
            />
          </div>

          <div class="form-group">
            <label for="verify-otp" class="block text-sm font-semibold text-white mb-2">Mã OTP</label>
            <input 
              type="text" 
              id="verify-otp"
              name="otp" 
              class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white text-center text-2xl tracking-widest placeholder-white/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              placeholder="000000"
              maxlength="6"
              required
            />
          </div>

          <button 
            type="submit"
            class="w-full rounded-lg bg-brand-accent px-4 py-3 text-center font-bold text-white shadow-red-glow transition hover:bg-[#cf141b]"
          >
            Xác Minh
          </button>
        </form>

        <!-- Resend OTP -->
        <p class="text-center text-sm text-white/60 mt-6">
          Chưa nhận được mã? 
          <button onclick="resendOtp()" type="button" class="text-brand-accent hover:underline font-semibold">
            Gửi lại
          </button>
        </p>
      </div>
    </div>
  `;
}

function renderVerifyPage() {
    const main = document.querySelector("main.layout");
    if (!main) return;

    const hasPendingEmail = !!pendingVerificationEmail;
    const emailSummary = typeof maskVerificationEmail === "function"
        ? maskVerificationEmail(pendingVerificationEmail)
        : pendingVerificationEmail;

    main.innerHTML = `
    <div class="mx-auto flex min-h-[calc(100vh-16rem)] max-w-3xl items-center justify-center py-10">
      <div class="w-full max-w-2xl rounded-[36px] border border-white/10 bg-white/[0.03] px-6 py-10 shadow-panel-soft backdrop-blur sm:px-10">
        <div class="mx-auto max-w-xl text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">OTP Verification</p>
          <h1 class="mt-5 text-3xl font-black text-white sm:text-5xl">Verify your Email</h1>
          <p class="mt-4 text-sm leading-7 text-white/60 sm:text-base">
            Enter the code we've sent to your inbox
            <span id="verify-email-label" class="ml-1 font-medium text-white/75">${emailSummary || "your@email.com"}</span>
          </p>
          <p class="mt-1 text-sm text-white/55">
            Didn't get the code?
            <button
              onclick="resendOtp()"
              type="button"
              id="btn-resend-otp"
              class="ml-1 font-semibold text-[#ff5a7a] transition hover:text-[#ff7f98]"
            >
              Resend it
            </button>
          </p>

          <form onsubmit="verifyOtp(event)" class="mt-10" id="verify-form">
            <div class="${hasPendingEmail ? "hidden" : "mx-auto mb-5 max-w-md text-left"}">
              <label for="verify-email" class="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                Verification Email
              </label>
              <input
                type="email"
                id="verify-email"
                name="email"
                class="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder-white/45 outline-none transition focus:border-[#ff5a7a] focus:ring-2 focus:ring-[#ff5a7a]/30"
                placeholder="your@email.com"
                value="${pendingVerificationEmail}"
                ${hasPendingEmail ? "readonly" : ""}
                required
              />
            </div>

            <input type="hidden" id="verify-otp" name="otp" value="" />

            <div class="grid grid-cols-6 gap-2 sm:gap-4">
              ${Array.from({ length: 6 }, (_, index) => `
                <input
                  type="text"
                  inputmode="numeric"
                  autocomplete="${index === 0 ? "one-time-code" : "off"}"
                  maxlength="1"
                  data-otp-digit
                  class="h-14 rounded-[18px] border border-white/6 bg-white/[0.06] text-center text-xl font-black text-white outline-none transition focus:border-[#ff5a7a] focus:bg-white/[0.10] focus:ring-2 focus:ring-[#ff5a7a]/35 sm:h-20 sm:text-3xl"
                />
              `).join("")}
            </div>

            <button
              type="submit"
              id="verify-submit"
              class="mt-6 w-full rounded-[18px] bg-[#b8b8b8] px-5 py-4 text-sm font-semibold text-[#141414] transition hover:bg-[#d0d0d0]"
            >
              Verify
            </button>
          </form>

          <p class="mt-5">
            <button
              type="button"
              onclick="router.navigate('/register')"
              class="text-sm font-medium text-white/45 transition hover:text-white/70"
            >
              Back to register
            </button>
          </p>
        </div>
      </div>
    </div>
  `;

    if (typeof attachVerificationFormEnhancements === "function") {
        attachVerificationFormEnhancements();
    }
}

/**
 * Jobs Listing Page
 */
function renderJobsPage() {
    const main = document.querySelector("main.layout");
    if (!main) return;

    main.innerHTML = `
    <div class="jobs-container">
      ${searchBar.render({
        locations: ["Tất cả thành phố", "Hà Nội", "TP.HCM", "Đà Nẵng"],
        tags: ["Java", "ReactJS", "Python", ".NET"],
    })}

      <!-- Jobs Grid -->
      <section class="jobs-grid">
        <h2 class="text-2xl font-bold text-white mb-8">Việc làm đang tuyển dụng</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ${generateJobCards()}
        </div>
      </section>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-12">
        <button type="button" class="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10">← Trước</button>
        <span class="px-4 py-2 rounded-lg bg-brand-accent text-white">1</span>
        <button type="button" class="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10">2</button>
        <button type="button" class="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10">3</button>
        <button type="button" class="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10">Tiếp →</button>
      </div>
    </div>
  `;
}

/**
 * Profile/Workspace Page (Authenticated)
 */
function renderProfilePage() {
    if (!token || !user) {
        router.navigate("/login");
        return;
    }

    const main = document.querySelector("main.layout");
    if (!main) return;

    const userRole = user.role || "candidate";

    main.innerHTML = `
    <div class="profile-container">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Khu vực của tôi</h1>
        <p class="text-white/60">Quản lý thông tin tài khoản và hoạt động của bạn</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <!-- Profile Card -->
        <div class="profile-card rounded-lg border border-white/10 bg-white/5 p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center text-3xl">👤</div>
            <div>
              <h2 class="text-xl font-bold text-white">${user.full_name || user.email}</h2>
              <p class="text-white/60 text-sm capitalize">${userRole === "employer" ? "Nhà tuyển dụng" : "Ứng viên"}</p>
            </div>
          </div>
          <button type="button" class="w-full rounded-lg bg-brand-accent px-4 py-2 text-white font-semibold transition hover:bg-[#cf141b]">
            Chỉnh sửa hồ sơ
          </button>
        </div>

        <!-- Stats -->
        <div class="stat-card rounded-lg border border-white/10 bg-white/5 p-6">
          <div class="text-3xl font-bold text-brand-accent mb-2">12</div>
          <p class="text-white/60">Hồ sơ đã nộp</p>
        </div>
        <div class="stat-card rounded-lg border border-white/10 bg-white/5 p-6">
          <div class="text-3xl font-bold text-brand-accent mb-2">3</div>
          <p class="text-white/60">Lời mời phỏng vấn</p>
        </div>
        <div class="stat-card rounded-lg border border-white/10 bg-white/5 p-6">
          <div class="text-3xl font-bold text-brand-accent mb-2">8</div>
          <p class="text-white/60">Công ty tìm hiểu</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex gap-2 border-b border-white/10 mb-6">
        <button type="button" class="px-4 py-3 border-b-2 border-brand-accent text-white font-semibold">Các ứng tuyển</button>
        <button type="button" class="px-4 py-3 border-b-2 border-transparent text-white/60 hover:text-white">Lưu việc làm</button>
        <button type="button" class="px-4 py-3 border-b-2 border-transparent text-white/60 hover:text-white">Cài đặt</button>
      </div>

      <!-- Applications List -->
      <div class="space-y-4">
        ${renderApplicationItem("Senior Backend Developer", "Rakuten", "2024-01-15", "Đang xem xét")}
        ${renderApplicationItem("Frontend Developer", "ONE Tech Stop", "2024-01-10", "Phỏng vấn")}
        ${renderApplicationItem("DevOps Engineer", "NAVER", "2024-01-05", "Không phù hợp")}
      </div>
    </div>
  `;
}

/**
 * 404 Not Found Page
 */
function render404Page() {
    const main = document.querySelector("main.layout");
    if (!main) return;

    main.innerHTML = `
    <div class="not-found-container text-center py-20">
      <div class="text-6xl font-black text-brand-accent mb-4">404</div>
      <h1 class="text-3xl font-bold text-white mb-2">Trang không tìm thấy</h1>
      <p class="text-white/60 mb-8">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <button 
        type="button" 
        class="inline-flex items-center justify-center rounded-lg bg-brand-accent px-6 py-3 text-white font-semibold transition hover:bg-[#cf141b]"
        onclick="router.navigate('/home')"
      >
        ← Quay lại trang chủ
      </button>
    </div>
  `;
}

// ============ Helper Functions ============

function renderCompanyCard(name, skills, jobCount, location) {
    return `
    <div class="company-card rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition cursor-pointer">
      <div class="text-4xl mb-4">🏢</div>
      <h3 class="text-lg font-bold text-white mb-2">${name}</h3>
      <p class="text-white/60 text-sm mb-3">${location}</p>
      <div class="flex flex-wrap gap-2 mb-4">
        ${skills.split(",").slice(0, 3).map((s) => `<span class="text-xs bg-white/10 rounded px-2 py-1 text-white/70">${s.trim()}</span>`).join("")}
      </div>
      <p class="text-brand-accent font-semibold text-sm">${jobCount}</p>
    </div>
  `;
}

function renderJobCardFull(title, company, location, salary, description) {
    return `
    <div class="job-card rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition p-6 cursor-pointer">
      <h3 class="text-lg font-bold text-white mb-2">${title}</h3>
      <p class="text-white/70 mb-2">${company}</p>
      <div class="flex justify-between items-center text-sm text-white/60 mb-4">
        <span>📍 ${location}</span>
        <span class="text-brand-accent font-semibold">${salary}/tháng</span>
      </div>
      <p class="text-white/60 text-sm mb-4">${description}</p>
      <button type="button" class="w-full rounded-lg bg-brand-accent/20 border border-brand-accent px-4 py-2 text-brand-accent font-semibold transition hover:bg-brand-accent hover:text-white">
        Xem chi tiết
      </button>
    </div>
  `;
}

function renderSkillTag(skill, count) {
    return `
    <div class="skill-tag rounded-lg border border-white/10 bg-white/5 p-4 text-center hover:bg-white/10 transition cursor-pointer">
      <p class="text-white font-semibold text-sm">${skill}</p>
      <p class="text-brand-accent text-xs mt-2">${count}</p>
    </div>
  `;
}

function renderApplicationItem(jobTitle, company, date, status) {
    const statusColor =
        status === "Phỏng vấn"
            ? "bg-green-500/20 text-green-300"
            : status === "Không phù hợp"
                ? "bg-red-500/20 text-red-300"
                : "bg-blue-500/20 text-blue-300";

    return `
    <div class="application-item rounded-lg border border-white/10 bg-white/5 p-4 flex items-center justify-between hover:bg-white/10 transition">
      <div>
        <h4 class="text-white font-semibold">${jobTitle}</h4>
        <p class="text-white/60 text-sm">${company} • ${date}</p>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor}">${status}</span>
    </div>
  `;
}

function generateJobCards() {
    const jobs = [
        { title: "Senior Backend Developer", company: "Rakuten", location: "Hà Nội", salary: "3000-4500", desc: "Build scalable systems" },
        { title: "Frontend Developer", company: "ONE Tech Stop", location: "TP.HCM", salary: "2500-3500", desc: "Create UX" },
        { title: "DevOps Engineer", company: "NAVER", location: "Đà Nẵng", salary: "3500-5000", desc: "Manage infrastructure" },
        { title: "Full Stack Developer", company: "Startup", location: "Hà Nội", salary: "2000-3000", desc: "Build web apps" },
    ];
    return jobs.map((job) => renderJobCardFull(job.title, job.company, job.location, job.salary, job.desc)).join("");
}

// ============ Event Listeners ============

function attachHomePageListeners() {
    const searchBtn = document.querySelector(".search-btn");
    if (searchBtn) {
        searchBtn.addEventListener("click", handleJobSearch);
    }

    document.querySelectorAll(".guest-keyword-tag").forEach((tag) => {
        tag.addEventListener("click", () => {
            const keyword = tag.getAttribute("data-home-keyword");
            const keywordInput = document.getElementById("keyword-filter");
            if (keywordInput) {
                keywordInput.value = keyword;
                handleJobSearch();
            }
        });
    });
}

function handleJobSearch() {
    showToast("Đang tìm kiếm công việc...");
    setTimeout(() => {
        router.navigate("/jobs");
    }, 500);
}
