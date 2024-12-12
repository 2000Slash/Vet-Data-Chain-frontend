import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/farmer.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const FarmerDashboard: React.FC = () => {
  const [balance, setBalance] = useState<string>("0");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const storedData = localStorage.getItem("loginData");
        if (!storedData) {
          navigate("/");
          return;
        }
        const parsedData = JSON.parse(storedData);
        const response = await axios.get(
          `${parsedData.nodeUrl}/addresses/balance/details/${parsedData.walletAddress}`
        );
        const wavesBalance = (
          parseInt(response.data.regular) / 100000000
        ).toFixed(8);
        setBalance(wavesBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, [navigate]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      // Example search implementation - adjust according to your API
      const storedData = localStorage.getItem("loginData");
      if (!storedData) return;

      const parsedData = JSON.parse(storedData);
      const response = await axios.get(
        `${parsedData.nodeUrl}/your-search-endpoint?term=${searchTerm}`
      );

      setSearchResults(response.data);
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="farmer-dashboard">
      <header className="dashboard-header">
        <h1>Farmer</h1>
        <div className="profile-circle"></div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <div className="unverified-list">
            <div className="unverified-item">unverified1</div>
            <div className="unverified-item">unverified1</div>
          </div>
        </aside>

        <main className="main-content-farmer">
          <div className="balance-container">
            <div className="balance-box">
              <i className="bi bi bi-wallet2" id="WalletIcon"></i>
              Balance: {balance}
            </div>
          </div>

          <div className="search-container">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Suche"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="search-button"
                onClick={handleSearch}
                aria-label="Search"
              >
                <i className="bi bi-search"></i>
              </button>
            </div>

            {/* Optional: Display search results */}
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result, index) => (
                  <div
                    key={`search-result-${index}`}
                    className="search-result-item"
                  >
                    <h3>{result.title}</h3>
                    {/* Add additional result content as needed */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;
