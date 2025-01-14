import React, {useState} from "react";
import "../../styles/details/Table.css";
import DetailInformationModal from "./DetailInformationModal";

interface TableProps {
  jsonData: {
    AaDRecords: string[];
  };
}

const Table: React.FC<TableProps> = ({ jsonData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    console.log("Modal open");
    setIsModalOpen(true);
  }

  const closeModal = () => {
    console.log("Modal closed");
    setIsModalOpen(false);
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">
              Number of Animals,Animal IDs, Species, Weight
            </th>
            <th scope="col">
              Diagnosis, Diagnosis date
            </th>
            <th scope="col">Medication name, Active ingredient, Pharmaceutical form </th>
            <th scope="col">Batch name</th>
            <th scope="col">Application amount</th>
            <th scope="col">Dosage per animal and day</th>
            <th scope="col">Route of administration</th>
            <th scope="col">Duration and timing of administration</th>
            <th scope="col">Withdrawal Period</th>
            <th scope="col">Treatment days, Effective days</th>
          </tr>
        </thead>
        <tbody>
        {jsonData.map((entry, entryIndex) => (
            entry.AaDRecords.map((record, recordIndex) => {
            const fields = record;
            return (
              <tr key={recordIndex}>
                <td>
                  {fields[0]},{fields[1]}, {fields[2]}, {fields[3]}kg
                </td>
                <td>
                  {fields[4]}, {fields[5].split("-").reverse().join(".")}
                </td>
                <td>
                  {fields[6]}, {fields[7]}, {fields[8]}
                </td>
                <td>{fields[9]}</td>
                <td>{fields[10]}</td>
                <td>{fields[11]}</td>
                <td>{fields[12]}</td>
                <td>{fields[13]}</td>
                <td>
                  {fields[14]}, {fields[15]}, {fields[16]}, {fields[17]}
                </td>
                <td>
                  {fields[18]}, {fields[19]}
                </td>
                <td className="button-cell">
                  <button className="button" onClick={() => openModal()}>Details</button>
                </td>
              </tr>
            );
          })
        ))}
        </tbody>
      </table>

      {isModalOpen && (
        <DetailInformationModal isModalOpen={isModalOpen} onClose={closeModal} jsonData={jsonData}/>
      )}
    </div>
  );
};

export default Table;
