import React from 'react';
import { useNavigate } from 'react-router-dom';

export const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="rounded-lg border border-white/10 bg-white/5 p-4 hover:border-brand-accent/50 transition cursor-pointer"
    >
      <h3 className="font-semibold text-white mb-2">{job.title}</h3>
      <p className="text-sm text-white/60 mb-3">{job.company}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-brand-accent">{job.salary}</span>
        <span className="text-xs text-white/40">📍 {job.location}</span>
      </div>
    </div>
  );
};

export const JobCardFull = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="rounded-[20px] border border-white/10 bg-white/5 backdrop-blur p-6 hover:border-brand-accent/50 transition cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
          <p className="text-white/60">{job.company}</p>
        </div>
        <span className="rounded-full bg-brand-accent/20 px-3 py-1 text-sm text-brand-accent whitespace-nowrap">
          {job.salary}
        </span>
      </div>

      <p className="text-white/70 mb-4">{job.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {job.skills?.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
            >
              {skill}
            </span>
          ))}
          {job.skills?.length > 3 && (
            <span className="text-xs text-white/60">+{job.skills.length - 3}</span>
          )}
        </div>
        <span className="text-xs text-white/40">📍 {job.location}</span>
      </div>
    </div>
  );
};

export default { JobCard, JobCardFull };
