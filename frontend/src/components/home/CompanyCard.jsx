import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CompanyCard = ({ name, skills, jobCount, location }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 backdrop-blur p-6 hover:border-brand-accent/50 transition cursor-pointer"
      onClick={() => navigate(`/jobs?company=${name}`)}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-white">{name}</h3>
        <span className="rounded-full bg-brand-accent/20 px-3 py-1 text-sm text-brand-accent">
          {jobCount}
        </span>
      </div>
      <p className="text-sm text-white/60 mb-4">{skills}</p>
      <p className="text-xs text-white/40">📍 {location}</p>
    </div>
  );
};

export default CompanyCard;
