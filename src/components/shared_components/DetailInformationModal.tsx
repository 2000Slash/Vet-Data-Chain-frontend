import { useState, useEffect } from "react";
import { filterDatabase } from "../../utils/sqlRequests";
import "../../styles/details/DetailInformationModal.css";

interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  signatureId: number;
  dateOfIssueId: number;
  contactDataVetenaryId: number;
  contactDataFarmerId: number;
}

const DetailInformationModal: React.FC<ModalProps> = ({
  isModalOpen,
  onClose,
  signatureId,
  dateOfIssueId,
  contactDataVetenaryId,
  contactDataFarmerId,
}) => {
  const [signatureData, setSignatureData] = useState<any>(null);
  const [dateOfIssueData, setDateOfIssueData] = useState<any>(null);
  const [contactDataVetenary, setContactDataVetenary] = useState<any>(null);
  const [contactDataFarmer, setContactDataFarmer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        setSignatureData(await filterDatabase("signatures", [["signatures", "recordId", signatureId]]));
        console.log("Signature Data:", signatureData);
        setDateOfIssueData(await filterDatabase("dateOfIssue", [["dateOfIssue", "recordId", dateOfIssueId]]));
        console.log("Date of Issue Data:", dateOfIssueData);
        setContactDataVetenary(await filterDatabase("contactDataVetenary", [["contactDataVetenary", "recordId", contactDataVetenaryId]]));
        console.log("Veterinary Contact Data:", contactDataVetenary);
        setContactDataFarmer(await filterDatabase("contactDataFarmer", [["contactDataFarmer", "recordId", contactDataFarmerId]]));
        console.log("Farmer Contact Data:", contactDataFarmer);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    isModalOpen,
    signatureId,
    dateOfIssueId,
    contactDataVetenaryId,
    contactDataFarmerId,
  ]);

  if (!isModalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h1 className="headline">Additional Information</h1>
        <div className="text-container">
          {isLoading ?.[0]? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="text-box">
                <h2 className="headline-text-box">Veterinary Contact Data</h2>
                <div className="information-box">
                  <p>
                    Name: {contactDataVetenary?.[0]?.vetTitle} {contactDataVetenary?.[0]?.vetFirstName} {contactDataVetenary?.[0]?.vetLastName}
                  </p>
                  <p>
                    Address: {contactDataVetenary?.[0]?.vetStreet} {contactDataVetenary?.[0]?.vetHuseNumber}, {contactDataVetenary?.[0]?.vetPostalCode} {contactDataVetenary?.[0]?.vetCity}
                  </p>
                </div>
              </div>
              <div className="text-box">
                <h2 className="headline-text-box">Farmer Contact Data</h2>
                <div className="information-box">
                  <p>
                    Name: {contactDataFarmer?.[0]?.farmerTitle} {contactDataFarmer?.[0]?.farmerFirstName} {contactDataFarmer?.[0]?.farmerLastName}
                  </p>
                  <p>
                    Address: {contactDataFarmer?.[0]?.farmerStreet} {contactDataFarmer?.[0]?.farmerHouseNumber}, {contactDataFarmer?.[0]?.farmerPostalCode} {contactDataFarmer?.[0]?.farmerCity}
                  </p>
                  <p>Phone: {contactDataFarmer?.[0]?.farmerPhoneNumber}</p>
                  <p>
                    Vieh-Verkehrs-Verordnungs-Nummer:{" "}
                    {contactDataFarmer?.[0]?.vetVerordnungNumber || "N/A"}
                  </p>
                </div>
              </div>
              <div className="text-box">
                <p>Date of Issue: {dateOfIssueData?.[0]?.dateOfIssue || "N/A"}</p>
              </div>
            </>
          )}
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DetailInformationModal;
