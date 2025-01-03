import React from "react";
import "./table.css";

interface TableProps {
  jsonData: {
    AaDRecords: string[];
  };
}

const Table: React.FC<TableProps> = ({ jsonData }) => {
  console.log("Angekommenes JSON-Objekt:", jsonData.AaDRecords);

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">
              Anzahl, Art, Identität bzw. Nutzungsart, <br />
              ggf. geschätztes Gewicht der Tiere
            </th>
            <th scope="col">
              Diagnose, <br /> bei Antibiotika zusätzlich <br /> das
              Untersuchungsdatum
            </th>
            <th scope="col">Arzneimittelbezeichnung</th>
            <th scope="col">Chargenbezeichnung</th>
            <th scope="col">Anwendungs-/Abgabemenge</th>
            <th scope="col">Dosierung pro Tier und Tag</th>
            <th scope="col">Art der Anwendung</th>
            <th scope="col">Dauer und Zeitpunkt der Anwendung</th>
            <th scope="col">Wartezeit, auch wenn diese gleich 0 ist</th>
            <th scope="col">Behandlungstage, ggf. Wirktage</th>
          </tr>
        </thead>
        <tbody>
          {jsonData.AaDRecords.map((record, index) => {
            const fields = record.split(",");
            return (
              <tr key={index}>
                <td>
                  {fields[0]}, {fields[1]}, {fields[2]}kg
                </td>
                <td>
                  {fields[3]}, {fields[4].split("-").reverse().join(".")}
                </td>
                <td>
                  {fields[5]}, {fields[6]}, {fields[7]}
                </td>
                <td>{fields[8]}</td>
                <td>{fields[9]}</td>
                <td>{fields[10]}</td>
                <td>{fields[11]}</td>
                <td>{fields[12]}</td>
                <td>
                  {fields[13]}, {fields[14]}, {fields[15]}, {fields[16]}
                </td>
                <td>
                  {fields[17]}, {fields[18]}
                </td>
                <td className="button-cell">
                  <button className="button">Details</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
