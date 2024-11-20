import React, { useEffect, useState } from "react";

interface VetData {
  identName: string;
  rolle: string;
  nodeUrl: string;
  walletAddress: string;
  publicKey: string;
  privateKey: string;
  seed: string;
}

const Vet: React.FC = () => {
  const [data, setData] = useState<VetData | null>(null);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("loginData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  if (!data) {
    return <p>Keine Daten gefunden. Bitte erneut einloggen.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Veterinäramt Dashboard</h1>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Feld</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Wert</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>
                {key}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vet;
