// login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import YAML from "yaml";
import axios from "axios";
import "./styles/styles.css";

const Login: React.FC = () => {
  const [fileData, setFileData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsedData = YAML.parse(text);
      setFileData(parsedData);
      localStorage.setItem("loginData", JSON.stringify(parsedData));
      setUploadStatus("success");
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(
        "Error reading file. Please ensure the format is correct."
      );
      setFileData(null);
      setUploadStatus("error");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleLogin = async () => {
    if (!fileData) {
      setErrorMessage("Please upload a file first.");
      return;
    }
    try {
      const response = await axios.get(
        `${fileData.nodeUrl}/addresses/balance/details/${fileData.walletAddress}`
      );
      localStorage.setItem("walletBalance", response.data.regular);
      navigate("/farmer");
    } catch (error) {
      setErrorMessage("Failed to fetch wallet balance");
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="logo-container">
          <div className="logo-circle"></div>
          <h1>Vet-Data-Chain</h1>
        </div>
      </div>

      <div className="main-content">
        <div className="card info-card">
          <div className="card-header">
            <h2>Vet-Data-Chain</h2>
          </div>
          <p>
            Vet-Data-Chain is your innovative partner for managing Application
            and Delivery Records (AuA Records) with ease and confidence.
            Designed for veterinarians, farmers, and veterinary authorities,
            this cutting-edge solution simplifies the way vital data is
            recorded, shared, and verified.
          </p>
        </div>

        <div className="card login-card">
          <div className="info-icon" onClick={() => setShowInfoModal(true)}>
            i
          </div>
          <div className="upload-section">
            <div className="login-icon">⤶</div>
            <p>
              Please drag and drop your login file here or click to select the
              file.
            </p>
            <div
              className={`drop-zone ${
                uploadStatus !== "idle" ? uploadStatus : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="file-input"
                accept=".yaml,.yml"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="file-input">
                <div className="upload-arrow">⇧</div>
              </label>
            </div>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
          <button
            className="login-button"
            onClick={handleLogin}
            disabled={!fileData}
          >
            Login
          </button>
        </div>
      </div>

      {showInfoModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowInfoModal(false)}
            >
              ←
            </button>
            <p>
              If you have not yet received your credentials file, please contact
              your responsible veterinary office.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
