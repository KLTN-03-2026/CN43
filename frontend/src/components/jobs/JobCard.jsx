import React from 'react';
import { useNavigate } from 'react-router-dom';

export const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4 hover:border-brand-accent/50 transition cursor-pointer"
    >
      <h3 className="font-semibold text-sm sm:text-base text-white mb-2 line-clamp-2">{job.title}</h3>
      <p className="text-xs sm:text-sm text-white/60 mb-3">{job.company}</p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm text-brand-accent truncate">{job.salary}</span>
        <span className="text-xs text-white/40 shrink-0">📍 {job.location}</span>
      </div>
    </div>
  );
};

export const JobCardFull = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="rounded-[20px] border border-white/10 bg-white/5 backdrop-blur p-4 sm:p-5 md:p-6 hover:border-brand-accent/50 transition cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-1 line-clamp-2">{job.title}</h3>
          <p className="text-xs sm:text-sm md:text-base text-white/60 truncate">{job.company}</p>
        </div>
        <span className="rounded-full bg-brand-accent/20 px-3 py-1 text-xs sm:text-sm text-brand-accent whitespace-nowrap self-start sm:self-auto">
          {job.salary}
        </span>
      </div>

      <p className="text-xs sm:text-sm md:text-base text-white/70 mb-3 sm:mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex gap-2 flex-wrap">
          {job.skills?.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 text-xs text-white/80"
            >
              {skill}
            </span>
          ))}
          {job.skills?.length > 3 && (
            <span className="text-xs text-white/60">+{job.skills.length - 3}</span>
          )}
        </div>
        <span className="text-xs text-white/40 self-start sm:self-auto">📍 {job.location}</span>
      </div>
    </div>
  );
};

export default { JobCard, JobCardFull };
