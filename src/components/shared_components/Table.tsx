import React, {useState} from "react";
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

  const openModal = (record: AaDRecord) => {
    console.log("Modal open");
    console.log(jsonData);
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Modal closed");
    setSelectedRecord(null);
    setIsModalOpen(false);
  };

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
        {jsonData.map((record: any, recordIndex: number) => (
          <tr key={recordIndex}>
            <td>
              {record.numberOfAnimals}, {record.animalIDS}, {record.species}, {record.weight}kg
            </td>
            <td>
              {record.diagnosis}, {record.diagnosisDate.split("-").reverse().join(".")}
            </td>
            <td>
              {record.medicationName}, {record.activeIngredient}, {record.pharmaceuticalForm}
            </td>
            <td>{record.batchName}</td>
            <td>{record.applicationAmount}</td>
            <td>{record.dosagePerAnimalDay}</td>
            <td>{record.routeOfAdministration}</td>
            <td>{record.durationAndTiming}</td>
            <td>
              {record.withdrawalEdible}, {record.withdrawalMilk}, {record.withdrawalEggs}, {record.withdrawalHoney}
            </td>
            <td>
              {record.treatmentDays}, {record.effectiveDays}
            </td>
            <td className="button-cell">
              <button className="button" onClick={() => openModal(record)}>Details</button>
            </td>
          </tr>
      ))}
</tbody>
      </table>

      {isModalOpen && selectedRecord && (
        <DetailInformationModal
          isModalOpen={isModalOpen}
          onClose={closeModal}
          signatureId={selectedRecord.signatureId}
          contactDataVetenaryId={selectedRecord.contactDataVetenaryId}
          contactDataFarmerId={selectedRecord.contactDataFarmerId}
          dateOfIssueId={selectedRecord.dateOfIssueId}        />
      )}
    </div>
  );
};

export default Table;




