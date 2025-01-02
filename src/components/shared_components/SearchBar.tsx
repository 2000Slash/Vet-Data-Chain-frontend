import { useState } from "react";
import "../../styles/styles.css";
import "../../styles/details/SearchBar.css";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
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
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
