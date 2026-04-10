// Internationalization utilities

const ROLE_LABEL = {
  vi: { candidate: "Ứng viên", employer: "Nhà tuyển dụng" },
  en: { candidate: "Candidate", employer: "Employer" },
};

const I18N = {
  vi: {
    nav: {
      jobs: "Việc Làm IT",
      top: "Top Công ty IT",
      blog: "Blog",
      domain: "Lĩnh vực IT",
    },
    auth: { login: "Đăng Nhập", register: "Đăng Ký" },
    hero: {
      title: '<span class="hero-number">1,188</span> Việc làm IT cho Developer<br /><span class="highlight">\'Chất\'</span>',
      sub: "Tìm đúng việc bằng bộ lọc siêu nhanh, theo dõi hồ sơ đã nộp và quay lại thao tác quan trọng trong một giao diện gọn gàng hơn.",
    },
    search: {
      placeholder: "Nhập từ khoá theo kỹ năng, chức vụ, công ty...",
      locationAll: "Tất cả thành phố",
      button: "Tìm Kiếm",
    },
    tags: {
      label: "Mọi người đang tìm kiếm:",
      list: ["Java", "ReactJS", ".NET", "Tester", "PHP", "NodeJS", "Business Analysis", "Team Management"],
    },
    marquee: [
      "Khám phá Top 30 Công ty IT tốt nhất 2026",
      "Công ty IT Tốt nhất Việt Nam 2026",
      "Khám phá bảng xếp hạng lương IT",
    ],
    features: ["Tìm việc thụ động", "Mẫu CV chuẩn IT", "Story Hub", "Review công ty", "Báo cáo lương IT"],
  },
  en: {
    nav: {
      jobs: "IT Jobs",
      top: "Top IT Companies",
      blog: "Blog",
      domain: "IT Domains",
    },
    auth: { login: "Login", register: "Register" },
    hero: {
      title: '<span class="hero-number">1,188</span> IT Jobs for Developers<br /><span class="highlight">Quality</span>',
      sub: "Find the right job with super fast filters, track submitted applications and revisit important actions in a cleaner interface.",
    },
    search: {
      placeholder: "Enter keywords by skills, position, company...",
      locationAll: "All cities",
      button: "Search",
    },
    tags: {
      label: "People are searching for:",
      list: ["Java", "ReactJS", ".NET", "Tester", "PHP", "NodeJS", "Business Analysis", "Team Management"],
    },
    marquee: [
      "Discover Top 30 Best IT Companies 2026",
      "Best IT Companies in Vietnam 2026",
      "Explore IT Salary Rankings",
    ],
    features: ["Passive Job Search", "Standard IT CV Templates", "Story Hub", "Company Reviews", "IT Salary Reports"],
  },
};

let currentLang = localStorage.getItem("jp_lang") || "vi";

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("jp_lang", lang);
  // Trigger re-render if needed
}

function t(key) {
  const keys = key.split('.');
  let value = I18N[currentLang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}

// Export
window.I18N = { t, setLanguage, ROLE_LABEL };