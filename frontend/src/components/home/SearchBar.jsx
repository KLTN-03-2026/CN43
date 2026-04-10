import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const locations = ['Tất cả thành phố', 'Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Huế'];
  const tags = ['Java', 'ReactJS', '.NET', 'NodeJS', 'Python', 'Go', 'Rust'];

  return (
    <div className="mb-16">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex flex-col gap-4 md:flex-row md:gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm vị trí, công ty, kỹ năng..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="form-input flex-1"
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-input md:w-40"
          >
            <option value="">Tất cả thành phố</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-brand-accent px-8 py-3 font-semibold text-white hover:bg-[#cf141b] transition"
          >
            Tìm kiếm
          </button>
        </div>
      </form>

      {/* Quick Filter Tags */}
      <div>
        <p className="text-white/60 mb-4 text-sm">Hoặc tìm kiếm theo kỹ năng:</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setKeyword(tag);
                navigate(`/jobs?keyword=${tag}`);
              }}
              className="rounded-full border border-brand-accent/50 px-4 py-2 text-sm text-white hover:bg-brand-accent/10 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
