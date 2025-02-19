import React, { useState } from "react";
import "../../styles/details/Table.css";
import DetailInformationModal from "./DetailInformationModal";

interface AaDRecord {
  signatureId: number;
  numberOfAnimals: number;
  animalIDS: string;
  species: string;
  weight: number;
  diagnosis: string;
  diagnosisDate: string;
  medicationName: string;
  activeIngredient: string;
  pharmaceuticalForm: string;
  batchName: string;
  applicationAmount: string;
  dosagePerAnimalDay: string;
  routeOfAdministration: string;
  durationAndTiming: string;
  withdrawalEdible: string;
  withdrawalMilk: string;
  withdrawalEggs: string;
  withdrawalHoney: string;
  treatmentDays: string;
  effectiveDays: string;
  contactDataVetenaryId: number;
  contactDataFarmerId: number;
  dateOfIssueId: number;
}

interface TableProps {
  jsonData: {
    AaDRecords: AaDRecord[];
  };
}
const Table: React.FC<TableProps> = ({ jsonData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AaDRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jsonData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jsonData.length / itemsPerPage);
  const [pageInput, setPageInput] = useState("");

  const handleDirectPageGo = () => {
    const pageNumber = parseInt(pageInput);
    if (pageNumber && pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setPageInput("");
    }
  };

  const openModal = (record: AaDRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(false);
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Number of Animals,Animal IDs, Species, Weight</th>
            <th scope="col">Diagnosis, Diagnosis date</th>
            <th scope="col">
              Medication name, Active ingredient, Pharmaceutical form
            </th>
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
          {currentItems.map((record: any, recordIndex: number) => (
            <tr key={recordIndex}>
              <td>
                {record.numberOfAnimals}, {record.animalIDS}, {record.species},{" "}
                {record.weight}kg
              </td>
              <td>
                {record.diagnosis},{" "}
                {record.diagnosisDate.split("-").reverse().join(".")}
              </td>
              <td>
                {record.medicationName}, {record.activeIngredient},{" "}
                {record.pharmaceuticalForm}
              </td>
              <td>{record.batchName}</td>
              <td>{record.applicationAmount}</td>
              <td>{record.dosagePerAnimalDay}</td>
              <td>{record.routeOfAdministration}</td>
              <td>{record.durationAndTiming}</td>
              <td>
                {record.withdrawalEdible}, {record.withdrawalMilk},{" "}
                {record.withdrawalEggs}, {record.withdrawalHoney}
              </td>
              <td>
                {record.treatmentDays}, {record.effectiveDays}
              </td>
              <td className="button-cell">
                <button className="button" onClick={() => openModal(record)}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <div className="page-input-container">
          <button
            onClick={handleDirectPageGo}
            className="pagination-button"
            disabled={!pageInput}
          >
            Go
          </button>
          <input
            type="number"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className="page-input"
            min="1"
            max={totalPages}
          />
        </div>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      {isModalOpen && selectedRecord && (
        <DetailInformationModal
          isModalOpen={isModalOpen}
          onClose={closeModal}
          signatureId={selectedRecord.signatureId}
          contactDataVetenaryId={selectedRecord.contactDataVetenaryId}
          contactDataFarmerId={selectedRecord.contactDataFarmerId}
          dateOfIssueId={selectedRecord.dateOfIssueId}
        />
      )}
    </div>
  );
};

export default Table;
