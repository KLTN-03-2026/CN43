import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COPY = {
  vi: {
    eyebrow: 'Nhiều cơ hội việc làm nổi bật',
    heroCount: '1,188',
    heroLead: 'Việc làm cho nhiều ngành nghề',
    heroAccent: "'Chất'",
    heroSub:
      'Tìm đúng việc bằng bộ lọc siêu nhanh, theo dõi hồ sơ đã nộp và quay lại thao tác quan trọng trong một giao diện gọn gàng hơn.',
    searchButton: 'Tìm Kiếm',
    searchPlaceholder: 'Nhập từ khóa theo kỹ năng, chức vụ, công ty...',
    searchLocation: 'Tất cả thành phố',
    tagsLabel: 'Mọi người đang tìm kiếm:',
    cities: ['Hà Nội', 'TP.HCM', 'Đà Nẵng'],
    tags: ['Java', 'ReactJS', '.NET', 'Tester', 'PHP', 'NodeJS', 'Business Analysis', 'Team Management'],
    marquee: [
      'Khám phá Top 30 công ty tuyển dụng tốt nhất 2026',
      'Doanh nghiệp nổi bật với môi trường làm việc hấp dẫn',
      'Khám phá bảng xếp hạng mức lương theo ngành nghề',
      'Top công ty đáng mơ ước cho người đi làm',
    ],
    features: [
      {
        badge: 'HOT',
        title: 'Tìm việc thụ động',
        desc: 'Gợi ý công việc hợp kỹ năng và mục tiêu phát triển của bạn.',
        tone: 'orange',
        icon: 'spark',
      },
      {
        badge: 'HOT',
        title: 'Mẫu CV chuyên nghiệp',
        desc: 'Chuẩn hóa hồ sơ để ứng tuyển nhanh và rõ năng lực hơn.',
        tone: 'sky',
        icon: 'doc',
      },
      {
        badge: 'MỚI',
        title: 'Story Hub',
        desc: 'Cập nhật xu hướng nghề nghiệp và góc nhìn thực tế từ cộng đồng.',
        tone: 'pink',
        icon: 'check',
      },
      {
        badge: 'HOT',
        title: 'Review công ty',
        desc: 'Đọc đánh giá thật để chọn môi trường phù hợp hơn với bạn.',
        tone: 'green',
        icon: 'layers',
      },
      {
        badge: 'HOT',
        title: 'Báo cáo lương theo ngành',
        desc: 'So sánh mức lương để đưa ra quyết định tốt hơn cho bước tiếp theo.',
        tone: 'amber',
        icon: 'chart',
      },
    ],
  },
  en: {
    eyebrow: 'Top opportunities across industries',
    heroCount: '1,188',
    heroLead: 'Jobs Across Many Professions',
    heroAccent: "'Quality'",
    heroSub:
      'Find the right job with lightning-fast filters, track submitted applications, and return to key actions in one cleaner interface.',
    searchButton: 'Search',
    searchPlaceholder: 'Search by skills, titles, company...',
    searchLocation: 'All cities',
    tagsLabel: 'People are searching for:',
    cities: ['Hanoi', 'Ho Chi Minh City', 'Da Nang'],
    tags: ['Java', 'ReactJS', '.NET', 'Tester', 'PHP', 'NodeJS', 'Business Analysis', 'Team Management'],
    marquee: [
      'Discover Top 30 Best Hiring Companies 2026',
      'Leading workplaces in Vietnam 2026',
      'Explore salary rankings across industries',
      'Dream workplaces for job seekers',
    ],
    features: [
      {
        badge: 'HOT',
        title: 'Passive job search',
        desc: 'Get role suggestions that match your skills and long-term direction.',
        tone: 'orange',
        icon: 'spark',
      },
      {
        badge: 'HOT',
        title: 'Professional CV Templates',
        desc: 'Polish your profile so you can apply faster with clearer strengths.',
        tone: 'sky',
        icon: 'doc',
      },
      {
        badge: 'NEW',
        title: 'Story Hub',
        desc: 'Stay close to real-world career trends and developer perspectives.',
        tone: 'pink',
        icon: 'check',
      },
      {
        badge: 'HOT',
        title: 'Company reviews',
        desc: 'Read honest feedback before choosing your next environment.',
        tone: 'green',
        icon: 'layers',
      },
      {
        badge: 'HOT',
        title: 'Industry salary report',
        desc: 'Compare salary ranges and make your next move with more clarity.',
        tone: 'amber',
        icon: 'chart',
      },
    ],
  },
};

const featureToneClasses = {
  orange: 'from-orange-200 via-rose-300 to-orange-500 shadow-orange-500/20',
  sky: 'from-sky-200 via-cyan-300 to-blue-500 shadow-sky-500/20',
  pink: 'from-fuchsia-200 via-pink-300 to-rose-500 shadow-pink-500/20',
  green: 'from-emerald-200 via-lime-300 to-emerald-500 shadow-emerald-500/20',
  amber: 'from-amber-200 via-yellow-300 to-red-500 shadow-red-500/20',
};

function FeatureIcon({ icon }) {
  if (icon === 'doc') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 4h8l4 4v12H4V4h4Z" strokeLinejoin="round" />
        <path d="M8 11h8M8 15h5" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === 'check') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.5v-9Z" />
        <path d="m9 10 2.5 2L15 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === 'layers') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 5 4 9l8 4 8-4-8-4Z" />
        <path d="m4 15 8 4 8-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === 'chart') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 17h14M7 14l3-4 3 2 4-6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 6h2v2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="7" />
      <path d="m12 8 1.6 3.6L17 13l-3.4 1.4L12 18l-1.6-3.6L7 13l3.4-1.4L12 8Z" />
    </svg>
  );
}

export const HeroBanner = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const copy = COPY.vi;

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set('keyword', keyword.trim());
    }

    if (location) {
      params.set('location', location);
    }

    const query = params.toString();
    navigate(query ? `/jobs?${query}` : '/jobs');
  };

  const handleTagClick = (tag) => {
    setKeyword(tag);
    navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-black via-[#16070d] to-[#260912] p-5 shadow-panel-soft sm:p-8 xl:p-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-6 h-52 w-52 rounded-full bg-brand-accent/16 blur-3xl" />
        <div className="absolute right-8 top-0 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-12 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="max-w-[900px]">
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-white/65">
              {copy.eyebrow}
            </p>

            <h1 className="text-balance text-[clamp(2.8rem,6vw,5.2rem)] font-black leading-[0.95] tracking-tight text-white">
              <span className="text-brand-accent drop-shadow-[0_0_24px_rgba(237,28,36,0.28)]">{copy.heroCount}</span>{' '}
              {copy.heroLead}
              <br />
              <span className="mt-1 inline-block underline decoration-2 underline-offset-4">{copy.heroAccent}</span>
            </h1>

            <p className="mt-5 max-w-[760px] text-base leading-8 text-brand-muted sm:text-lg">{copy.heroSub}</p>
          </div>
        </div>

        <form
          className="relative mt-8 overflow-visible rounded-[28px] border-2 border-brand-accent bg-black/20 p-2.5 shadow-[0_24px_76px_rgba(0,0,0,0.28)]"
          role="search"
          onSubmit={handleSearch}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-brand-accent/15" />
          <div className="pointer-events-none absolute -top-2 left-2 right-2 h-4 rounded-t-[24px] bg-brand-accent/30" />

          <div className="relative z-10 grid gap-3 lg:grid-cols-[250px_minmax(0,1fr)_210px]">
            <label className="flex items-center gap-3 rounded-[20px] border border-zinc-200 bg-white px-4 py-4 transition focus-within:border-brand-accent/40 focus-within:ring-4 focus-within:ring-brand-accent/10">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-zinc-500" stroke="currentColor" strokeWidth="1.8">
                <path
                  d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="11" r="2.2" />
              </svg>
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                aria-label={copy.searchLocation}
                className="w-full border-0 bg-transparent p-0 text-base font-semibold text-zinc-900 outline-none focus:ring-0"
              >
                <option value="">{copy.searchLocation}</option>
                {copy.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-[20px] border border-zinc-200 bg-white px-4 py-4 transition focus-within:border-brand-accent/40 focus-within:ring-4 focus-within:ring-brand-accent/10">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-zinc-500" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="6" />
                <path d="m20 20-4.2-4.2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="w-full border-0 bg-transparent p-0 text-base font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-0"
                placeholder={copy.searchPlaceholder}
              />
            </label>

            <button
              type="submit"
              className="inline-flex min-h-[68px] items-center justify-center gap-3 rounded-[20px] bg-brand-accent px-6 text-base font-bold text-white shadow-red-glow transition hover:-translate-y-0.5 hover:bg-[#cf141b]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m20 20-4.2-4.2" strokeLinecap="round" />
                </svg>
              </span>
              <span>{copy.searchButton}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <span className="shrink-0 text-sm font-semibold uppercase tracking-[0.24em] text-white/55">
            {copy.tagsLabel}
          </span>
          <div className="flex flex-wrap gap-3">
            {copy.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="inline-flex rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-zinc-800"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="marquee-shell mt-7 rounded-[28px] border border-white/10 bg-white/[0.04] p-3 sm:p-4">
          <div className="overflow-hidden">
            <div className="marquee-track flex w-max min-w-max whitespace-nowrap will-change-transform">
              {[0, 1].map((groupIndex) => (
                <div key={groupIndex} className="flex items-center">
                  {copy.marquee.map((item) => (
                    <React.Fragment key={`${groupIndex}-${item}`}>
                      <button
                        type="button"
                        onClick={() => navigate('/jobs')}
                        className="inline-flex min-h-[2.55rem] items-center rounded-full border border-white/10 bg-black/30 px-4 text-sm font-medium text-white/90 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                      >
                        {item}
                      </button>
                      <span className="mx-3 text-white/25" aria-hidden="true">
                        |
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {copy.features.map((feature) => (
            <article
              key={feature.title}
              className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#18181b] p-4 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#1d1d21]"
            >
              <span
                className={[
                  'absolute left-4 top-4 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white',
                  feature.badge === 'MỚI' || feature.badge === 'NEW' ? 'bg-brand-accent' : 'bg-orange-500',
                ].join(' ')}
              >
                {feature.badge}
              </span>
              <div
                className={[
                  'mt-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-[#0d0d0d] shadow-lg',
                  featureToneClasses[feature.tone],
                ].join(' ')}
              >
                <FeatureIcon icon={feature.icon} />
              </div>
              <p className="mt-5 text-lg font-semibold text-white">{feature.title}</p>
              <p className="mt-2 text-sm leading-6 text-brand-muted">{feature.desc}</p>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
};

export default HeroBanner;
