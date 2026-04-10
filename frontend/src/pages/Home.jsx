import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HeroBanner from '../components/home/HeroBanner';
import CompanyCard from '../components/home/CompanyCard';
import { JobCardFull } from '../components/jobs/JobCard';
import SkillTag from '../components/home/SkillTag';

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const companies = [
    { name: 'Rakuten', skills: 'Java, iOS, Android, SQL', jobCount: '2 Jobs', location: 'Ho Chi Minh' },
    { name: 'ONE Tech Stop', skills: 'Backend, Frontend, DevOps', jobCount: '6 Jobs', location: 'Da Nang' },
    { name: 'NAVER Vietnam', skills: 'JavaScript, React, Java', jobCount: '3 Jobs', location: 'Ho Chi Minh' },
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Backend Developer',
      company: 'Rakuten',
      salary: '3000-4500',
      location: 'Ha Noi',
      description: 'Build scalable backend systems',
      skills: ['Java', 'SQL', 'REST API'],
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'ONE Tech Stop',
      salary: '2500-3500',
      location: 'TP.HCM',
      description: 'Create amazing user experiences',
      skills: ['React', 'TypeScript', 'CSS'],
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      company: 'NAVER',
      salary: '3500-5000',
      location: 'Da Nang',
      description: 'Manage cloud infrastructure',
      skills: ['Docker', 'Kubernetes', 'AWS'],
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'Tech Startup',
      salary: '2000-3000',
      location: 'Ha Noi',
      description: 'Build web applications',
      skills: ['React', 'Node.js', 'MongoDB'],
    },
  ];

  const skills = [
    { name: 'Backend Development', count: '150+ jobs' },
    { name: 'Frontend Development', count: '120+ jobs' },
    { name: 'DevOps & Cloud', count: '80+ jobs' },
    { name: 'Data Engineer', count: '60+ jobs' },
    { name: 'Mobile Development', count: '45+ jobs' },
    { name: 'QA/Testing', count: '55+ jobs' },
    { name: 'System Design', count: '35+ jobs' },
    { name: 'AI/ML', count: '70+ jobs' },
  ];

  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      navigate('/profile');
      return;
    }

    navigate('/login', { state: { from: '/' } });
  };

  return (
    <div className="home-container">
      <HeroBanner />

      <section className="featured-companies mb-16">
        <h2 className="mb-8 text-2xl font-bold text-white">Công ty hàng đầu đang tuyển dụng</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.name} {...company} />
          ))}
        </div>
      </section>

      <section className="featured-jobs mb-16">
        <h2 className="mb-8 text-2xl font-bold text-white">Việc làm nổi bật</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {featuredJobs.map((job) => (
            <JobCardFull key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section className="it-skills mb-16">
        <h2 className="mb-8 text-2xl font-bold text-white">Kỹ năng đang cần tuyển</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <SkillTag key={skill.name} skill={skill.name} count={skill.count} />
          ))}
        </div>
      </section>

      <section className="cta-section mb-8 rounded-[20px] border border-brand-accent/30 bg-gradient-to-r from-brand-accent/20 to-blue-500/20 p-8 text-center md:p-12">
        <h2 className="mb-4 text-3xl font-bold text-white">Sẵn sàng tìm công việc tiếp theo?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-white/70">
          Tham gia cùng hàng ngàn ứng viên để tìm công việc mơ ước nhanh hơn, rõ ràng hơn và dễ theo dõi hơn.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-brand-accent px-8 py-3 text-lg font-semibold text-white shadow-red-glow transition hover:bg-[#cf141b]"
            onClick={handlePrimaryAction}
          >
            {isAuthenticated ? 'Mở hồ sơ của tôi' : 'Bắt đầu đăng nhập'}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-lg font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            onClick={() => navigate('/jobs')}
          >
            Xem danh sách việc làm
          </button>
        </div>
      </section>

      <section className="mb-8 grid gap-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-brand-accent/85">
            Tài khoản HOT CV
          </p>
          <h2 className="text-3xl font-bold text-white">
            {isAuthenticated ? `Chào mừng trở lại, ${user?.full_name || user?.email || 'bạn'}` : 'Đăng nhập để đồng bộ hành trình tìm việc'}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
            {isAuthenticated
              ? 'Trang chính giờ sẽ dẫn bạn nhanh đến hồ sơ, lịch sử ứng tuyển và các thao tác đã đăng nhập.'
              : 'Tài khoản giúp bạn lưu hồ sơ, theo dõi ứng tuyển và quay lại trang chính với đúng điểm đang thao tác.'}
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
          <div className="space-y-4 text-sm text-white/75">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">1. Đi từ trang chủ sang đăng nhập</p>
              <p className="mt-1">Nút trong header và CTA dưới banner đều đưa bạn đến màn hình đăng nhập mới.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">2. Đăng nhập xong quay lại đúng chỗ</p>
              <p className="mt-1">Nếu bạn vào từ một trang cần xác thực, hệ thống sẽ đưa bạn về đúng nơi vừa rời.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">3. Trang chính đổi theo trạng thái</p>
              <p className="mt-1">Sau khi vào tài khoản, CTA chuyển thành mở hồ sơ và menu hiện thêm khu vực cá nhân.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
