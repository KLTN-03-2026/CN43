/**
 * Reusable UI Components
 * Follows Clean Architecture: presentational components with clean interfaces
 */

/**
 * Header Component - Shows navigation and user status
 */
class HeaderComponent {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
    }

    /**
     * Render header HTML
     * @param {Object} state - User state
     * @returns {string} HTML string
     */
    render(state = {}) {
        this.isAuthenticated = state.isAuthenticated || false;
        this.user = state.user || null;

        return `
      <header class="site-header border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur-xl sticky top-0 z-50">
        <div class="nav-shell mx-auto flex max-w-[1320px] flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
          <!-- Logo -->
          <div class="nav-left flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-8">
            <a href="javascript:router.navigate('/home')" class="logo-chip inline-flex items-center gap-2 hover:opacity-80 transition" role="button" aria-label="HOT CV">
              <img 
                src="/static/logo/hotcv-dark.svg" 
                alt="HOT CV Logo" 
                class="h-10 w-auto"
              />
            </a>

            <!-- Navigation -->
            <nav class="main-nav flex flex-wrap items-center gap-2" aria-label="Primary">
              ${this.renderNavLinks()}
            </nav>
          </div>

          <!-- Right Section -->
          <div class="nav-right flex flex-wrap items-center gap-3 xl:justify-end">
            <button class="icon-btn inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white" type="button" aria-label="Thông báo">
              🔔
            </button>

            <!-- Auth Section -->
            <div class="nav-auth flex items-center gap-2">
              ${this.isAuthenticated ? this.renderAuthenticatedUser() : this.renderAuthButtons()}
            </div>

            <!-- Language Selector -->
            <div class="nav-lang inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1" aria-label="Ngôn ngữ">
              <button type="button" class="lang active rounded-full px-3 py-1.5 text-xs font-bold tracking-[0.22em]" data-lang="vi">VI</button>
              <button type="button" class="lang rounded-full px-3 py-1.5 text-xs font-bold tracking-[0.22em]" data-lang="en">EN</button>
            </div>
          </div>
        </div>
      </header>
    `;
    }

    /**
     * Render navigation links
     * @returns {string} HTML
     */
    renderNavLinks() {
        const links = [
            { label: "Việc Làm IT", route: "/jobs", icon: "💼" },
            { label: "Top Công ty IT", route: "#", icon: "🏢" },
            { label: "Blog", route: "#", icon: "📝" },
            { label: "Lĩnh vực IT", route: "#", icon: "🎯" },
        ];

        return links
            .map(
                (link) => `
      <a 
        data-route="${link.route}"
        href="javascript:router.navigate('${link.route}')" 
        class="nav-link inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white/72 transition hover:bg-white/6 hover:text-white"
      >
        ${link.label} <span class="caret ml-2 text-xs text-white/50">▾</span>
      </a>
    `
            )
            .join("");
    }

    /**
     * Render authentication buttons for guests
     * @returns {string} HTML
     */
    renderAuthButtons() {
        return `
      <button 
        type="button" 
        class="btn nav-login inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
        onclick="router.navigate('/login')"
      >
        Đăng Nhập
      </button>
      <button 
        type="button" 
        class="btn nav-register inline-flex items-center justify-center rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white shadow-red-glow transition hover:-translate-y-0.5 hover:bg-[#cf141b]"
        onclick="router.navigate('/register')"
      >
        Đăng Ký
      </button>
    `;
    }

    /**
     * Render authenticated user info
     * @returns {string} HTML
     */
    renderAuthenticatedUser() {
        if (!this.user) return "";

        return `
      <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90">
        ${this.user.full_name || this.user.email}
      </span>
      <span class="badge-role ${this.user.role === "employer" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"} rounded-full px-3 py-1 text-xs font-semibold">
        ${this.user.role === "employer" ? "Nhà tuyển dụng" : "Ứng viên"}
      </span>
      <button 
        type="button" 
        class="btn nav-login btn-sm inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
        onclick="router.navigate('/profile')"
      >
        Khu vực của tôi
      </button>
      <button 
        type="button" 
        class="btn btn-ghost btn-sm inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
        onclick="logout()"
      >
        Đăng xuất
      </button>
    `;
    }
}

/**
 * Footer Component - Shows company info and links
 */
class FooterComponent {
    /**
     * Render footer HTML
     * @returns {string} HTML string
     */
    render() {
        return `
      <footer class="site-footer border-t border-white/10 bg-[#0a0a0a] py-12 mt-16">
        <div class="mx-auto max-w-[1320px] px-4 sm:px-6 xl:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <!-- Company Info -->
            <div class="footer-section">
              <h3 class="text-xl font-black text-brand-accent mb-4">HOT CV</h3>
              <p class="text-white/60 text-sm mb-4">
                Nền tảng tuyển dụng IT hàng đầu tại Việt Nam. Kết nối nhà tuyển dụng và ứng viên tài năng.
              </p>
              <div class="flex gap-3">
                <a href="#" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 hover:bg-white/10">📱</a>
                <a href="#" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 hover:bg-white/10">💼</a>
                <a href="#" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 hover:bg-white/10">🎥</a>
              </div>
            </div>

            <!-- About Links -->
            <div class="footer-section">
              <h4 class="font-semibold text-white mb-4">Về chúng tôi</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-white/60 hover:text-white transition text-sm">Giới thiệu</a></li>
                <li><a href="#" class="text-white/60 hover:text-white transition text-sm">Blog</a></li>
                <li><a href="#" class="text-white/60 hover:text-white transition text-sm">Liên hệ</a></li>
                <li><a href="#" class="text-white/60 hover:text-white transition text-sm">Câu hỏi thường gặp</a></li>
              </ul>
            </div>

            <!-- For Employers -->
            <div class="footer-section">
              <h4 class="font-semibold text-white mb-4">Cho nhà tuyển dụng</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-white/60 hover:text-white transition text-sm">Đăng tin tuyển dụng</a></li>
                <li><a href="#" class="text-white/60 hover:text-white transition text-sm">Giải pháp tuyển dụng</a></li>
                <li><a href="#" class="text-white/60 hover:text-white transition text-sm">Pricing</a></li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div class="footer-section">
              <h4 class="font-semibold text-white mb-4">Liên hệ</h4>
              <ul class="space-y-2">
                <li class="text-white/60 text-sm">📍 Hà Nội, Việt Nam</li>
                <li class="text-white/60 text-sm">📧 support@hotcv.vn</li>
                <li class="text-white/60 text-sm">📱 +84 (0) 123 456 789</li>
              </ul>
            </div>
          </div>

          <!-- Bottom Section -->
          <div class="border-t border-white/5 pt-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
              <p class="text-white/50 text-sm">© 2024 HOT CV. All rights reserved.</p>
              <div class="flex gap-6">
                <a href="#" class="text-white/50 hover:text-white transition text-sm">Điều khoản dịch vụ</a>
                <a href="#" class="text-white/50 hover:text-white transition text-sm">Chính sách riêng tư</a>
                <a href="#" class="text-white/50 hover:text-white transition text-sm">Cookie</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
    }
}

/**
 * Hero Banner Component - Large intro section
 */
class HeroBannerComponent {
    /**
     * Render hero banner
     * @param {Object} config - Configuration
     * @returns {string} HTML string
     */
    render(config = {}) {
        const title = config.title || "1,188 Việc làm IT cho Developer 'Chất'";
        const subtitle = config.subtitle || "Tìm đúng việc bằng bộ lọc siêu nhanh, theo dõi hồ sơ đã nộp.";
        const image = config.image || "";

        return `
      <section class="hero-shell relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] p-4 shadow-panel-soft sm:p-6 xl:p-8 mb-12">
        <div class="hero-content relative z-10 max-w-[860px]">
          <h1 class="text-balance text-[clamp(2.4rem,5vw,3.8rem)] font-black leading-tight tracking-tight text-white mb-5">
            ${title}
          </h1>
          <p class="text-lg leading-7 text-white/70 mb-7 max-w-[640px]">
            ${subtitle}
          </p>
        </div>
        ${image ? `<div class="hero-image absolute right-0 bottom-0 opacity-20 -z-0">${image}</div>` : ""}
      </section>
    `;
    }
}

/**
 * Search Bar Component - Job search interface
 */
class SearchBarComponent {
    /**
     * Render search bar
     * @param {Object} config - Configuration
     * @returns {string} HTML string
     */
    render(config = {}) {
        const onSearch = config.onSearch || "handleJobSearch";
        const locations = config.locations || ["Tất cả thành phố", "Hà Nội", "TP.HCM", "Đà Nẵng"];
        const tags = config.tags || ["Java", "ReactJS", ".NET", "NodeJS", "Python"];

        return `
      <div class="search-section mb-12">
        <div class="search-bar rounded-[24px] border border-black/5 bg-white p-2.5 shadow-[0_24px_72px_rgba(0,0,0,0.24)]">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
            <!-- Location Selector -->
            <div class="search-field flex items-center gap-3 rounded-[18px] border border-zinc-200 bg-white px-4 py-3.5">
              <span class="text-lg">📍</span>
              <select id="location-filter" class="flex-1 bg-transparent text-gray-700 focus:outline-none">
                ${locations.map((loc) => `<option>${loc}</option>`).join("")}
              </select>
            </div>

            <!-- Keyword Input -->
            <div class="search-field flex items-center gap-3 rounded-[18px] border border-zinc-200 bg-white px-4 py-3.5 col-span-1 lg:col-span-1">
              <span class="text-lg">🔎</span>
              <input id="keyword-filter" type="text" class="flex-1 bg-transparent text-gray-700 focus:outline-none" placeholder="Kỹ năng, chức vụ, công ty..." />
            </div>

            <!-- Search Button -->
            <button type="button" ${onSearch ? `onclick="${onSearch}()"` : ""} class="btn search-btn inline-flex items-center justify-center gap-2 rounded-[18px] bg-brand-accent px-6 text-sm font-bold text-white shadow-red-glow transition hover:-translate-y-0.5 hover:bg-[#cf141b]">
              <span>🔍</span>
              <span>Tìm Kiếm</span>
            </button>
          </div>
        </div>

        <!-- Trending Tags -->
        <div class="tags-row mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <span class="tags-label text-sm font-semibold uppercase tracking-wider text-white/55">
            Mọi người đang tìm:
          </span>
          <div class="tag-list flex flex-wrap gap-3">
            ${tags.map((tag) => `<button type="button" class="tag-pill inline-flex rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-zinc-800">${tag}</button>`).join("")}
          </div>
        </div>
      </div>
    `;
    }
}

/**
 * Job Card Component - Single job listing
 */
class JobCardComponent {
    /**
     * Render job card
     * @param {Object} job - Job data
     * @returns {string} HTML string
     */
    render(job = {}) {
        const title = job.title || "Job Title";
        const company = job.company || "Company";
        const location = job.location || "Location";
        const salary = job.salary || "Competitive";
        const skills = job.skills || [];
        const description = job.description || "";

        return `
      <div class="job-card rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition cursor-pointer">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold text-white mb-2">${title}</h3>
            <p class="text-white/70">${company}</p>
          </div>
          <div class="text-right">
            <p class="text-brand-accent font-bold text-lg">${salary}</p>
            <p class="text-white/60 text-sm">${location}</p>
          </div>
        </div>
        
        <p class="text-white/70 text-sm mb-4 line-clamp-2">${description}</p>
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${skills.slice(0, 4).map((skill) => `<span class="tag inline-block bg-white/10 rounded-full px-3 py-1 text-xs text-white/80">${skill}</span>`).join("")}
        </div>

        <button type="button" class="btn btn-primary w-full rounded-lg bg-brand-accent px-4 py-2 text-white font-semibold transition hover:bg-[#cf141b]">
          Xem Thêm
        </button>
      </div>
    `;
    }
}

// Create component instances
const header = new HeaderComponent();
const footer = new FooterComponent();
const heroBanner = new HeroBannerComponent();
const searchBar = new SearchBarComponent();
const jobCard = new JobCardComponent();
