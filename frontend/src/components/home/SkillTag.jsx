import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SkillTag = ({ skill, count }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/jobs?keyword=${skill}`)}
      className="rounded-lg border border-white/10 bg-white/5 p-4 text-center hover:border-brand-accent/50 transition hover:bg-brand-accent/10"
    >
      <p className="font-medium text-white">{skill}</p>
      <p className="text-xs text-white/60 mt-1">{count}</p>
    </button>
  );
};

export default SkillTag;
