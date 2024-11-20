import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import YAML from "yaml";
import "./styles/styles.css"; // Assuming your CSS file is named styles.css and located in the same directory

const Login: React.FC = () => {
  const [fileData, setFileData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setErrorMessage("Bitte eine Datei auswählen.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = reader.result as string;
        // Parse YAML data
        const parsedData = YAML.parse(data);
        if (!parsedData.rolle) {
          setErrorMessage("Die Datei enthält keine gültige Rolle.");
          return;
        }

        // Save data to localStorage
        localStorage.setItem("loginData", JSON.stringify(parsedData));
        setFileData(JSON.stringify(parsedData));
        setErrorMessage(null);
      } catch (err) {
        setErrorMessage("Fehler beim Lesen der Datei. Bitte sicherstellen, dass das Format korrekt ist.");
      }
    };

    reader.readAsText(file);
  };

  const handleLogin = () => {
    if (!fileData) {
      setErrorMessage("Bitte zuerst eine Datei hochladen.");
      return;
    }

    const storedData = localStorage.getItem("loginData");
    if (!storedData) {
      setErrorMessage("Login-Daten nicht gefunden. Bitte erneut hochladen.");
      return;
    }

    const parsedData = JSON.parse(storedData);
    if (parsedData.rolle) {
      navigate(`/${parsedData.rolle}`);
    } else {
      setErrorMessage("Die Datei enthält keine gültige Rolle.");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Vet-Data-Chain</h1>
      </header>
      <main>
        <div className="login-box">
          <div className="upload-icon">
            <img src="login-2.png" alt="Upload Icon" />
          </div>
          <p>Please drag and drop your login file here or click to select the file.</p>
          <label htmlFor="file-input" className="file-input-label">
            <input
              type="file"
              id="file-input"
              accept=".yaml"
              hidden
              onChange={handleFileUpload}
            />
            <span className="upload-button">&#8682;</span>
          </label>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </main>
    </div>
  );
};

export default Login;
