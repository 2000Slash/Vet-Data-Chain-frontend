import React, { useState } from 'react';
import searchLineIcon from '../assets/search-line-icon.svg'

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Search term:', searchTerm);
  };

  return (
    <div className="search-container">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="search-button"
          onClick={handleSearch}
          aria-label="Search"
        >
          <img
            className="search-line-icon"
            src={searchLineIcon}
            alt="Search Icon"
            width="24"
            height="24"
          />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
