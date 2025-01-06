import React from "react";
import "../../styles/details/DetailInformationModal.css";

interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  jsonData: {
    AaDRecords: string[];
    ContactDataFarmer: string[];
    ContactDataVeterinary: string[];
    DateOfIssue: string;
  };
}

const DetailInformationModal: React.FC<ModalProps> = ({
  isModalOpen,
  onClose,
  jsonData,
}) => {
  if (!isModalOpen) return null;
  console.log("Modal JSON", jsonData);

  return (
    <div className="modal">
      <div className="modal-content">
        <h1 className="headline">Additional Information</h1>
        <div className="text-container">
          <div className="text-box">
            <h2 className="headline-text-box">Veterinary Contact Data</h2>
            <div className="information-box">
              <p>
                {jsonData.ContactDataVeterinary[0]}{" "}
                {jsonData.ContactDataVeterinary[1]}{" "}
                {jsonData.ContactDataVeterinary[2]}
              </p>
              <p>
                {jsonData.ContactDataVeterinary[3]}{" "}
                {jsonData.ContactDataVeterinary[4]}
              </p>
              <p>
                {jsonData.ContactDataVeterinary[5]}{" "}
                {jsonData.ContactDataVeterinary[6]}
              </p>
            </div>
          </div>
          <div className="text-box">
            <h2 className="headline-text-box">Farmer Contact Data</h2>
            <div className="information-box">
              <p>
                {jsonData.ContactDataFarmer[0]} {jsonData.ContactDataFarmer[1]}{" "}
                {jsonData.ContactDataFarmer[2]}
              </p>
              <p>
                {jsonData.ContactDataFarmer[3]} {jsonData.ContactDataFarmer[4]}
              </p>
              <p>
                {jsonData.ContactDataFarmer[5]} {jsonData.ContactDataFarmer[6]}
              </p>
              <p>
                Vieh-Verkehrs-Verordnungs-Nummer:{" "}
                {jsonData.ContactDataFarmer[7]}
              </p>
            </div>
          </div> 
        </div>
        <div className="text-box">
            <p>Date of issue: {jsonData.DateOfIssue}</p>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DetailInformationModal;
