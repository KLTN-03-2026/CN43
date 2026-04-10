import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { JobCard } from '../components/jobs/JobCard';

export const Jobs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const keyword = searchParams.get('keyword');
  const location = searchParams.get('location');
  const company = searchParams.get('company');

  useEffect(() => {
    // Simulate loading jobs
    setIsLoading(true);
    setTimeout(() => {
      // Mock data - replace with API call
      setJobs([
        { id: 1, title: 'Senior Backend Developer', company: 'Rakuten', salary: '3000-4500', location: 'Hà Nội' },
        { id: 2, title: 'Frontend Developer', company: 'ONE Tech Stop', salary: '2500-3500', location: 'TP.HCM' },
        { id: 3, title: 'DevOps Engineer', company: 'NAVER', salary: '3500-5000', location: 'Đà Nẵng' },
        { id: 4, title: 'Full Stack Developer', company: 'Tech Startup', salary: '2000-3000', location: 'Hà Nội' },
      ]);
      setIsLoading(false);
    }, 500);
  }, [keyword, location, company]);

  return (
    <div className="jobs-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Việc làm</h1>
        {(keyword || location || company) && (
          <p className="text-white/60">
            Kết quả tìm kiếm
            {keyword && ` cho "${keyword}"`}
            {location && ` tại "${location}"`}
            {company && ` của "${company}"`}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-white/60">Đang tải...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60 mb-4">Không tìm thấy việc làm</p>
          <button
            onClick={() => navigate('/jobs')}
            className="text-brand-accent hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
