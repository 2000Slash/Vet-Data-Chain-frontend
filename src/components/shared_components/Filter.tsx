import * as React from "react";
import "../../styles/details/Filter.css";
import { getAllTableNamess, getAllFields } from "../../utils/sqlRequests";


const nameDictionary = {
  aadRecords: "AaD-Record",
  contactDataFarmer: "Contact details (farmer)",
  contactDataVetenary: "Contact details (veterinary)",
  dateOfIssue: "Date of issue",
  signatures: "Signatures",
  recordId: "Record ID",
  numberOfAnimals: "Number of Animals",
  animalIDS: "Animal IDs",
  species: "Species",
  weight: "Weight (kg)",
  diagnosis: "Diagnosis",
  diagnosisDate: "Diagnosis Date",
  medicationName: "Medication Name",
  activeIngredient: "Active Ingredient",
  pharmaceuticalForm: "Pharmaceutical Form",
  batchName: "Batch Name",
  applicationAmount: "Application Amount (ml)",
  dosagePerAnimalDay: "Dosage Per Animal/Day (mg)",
  routeOfAdministration: "Route of Administration",
  durationAndTiming: "Duration and Timing",
  withdrawalEdible: "Withdrawal Period (Edible)",
  withdrawalMilk: "Withdrawal Period (Milk)",
  withdrawalEggs: "Withdrawal Period (Eggs)",
  withdrawalHoney: "Withdrawal Period (Honey)",
  treatmentDays: "Treatment Days",
  effectiveDays: "Effective Days",
  contactDataFarmerId: "Contact Data Farmer ID",
  contactDataVetenaryId: "Contact Data Veterinary ID",
  dateOfIssueId: "Date of Issue ID",
  signatureId: "Signature ID",
  farmerTitle: "Farmer Title",
  farmerFirstName: "First Name",
  farmerLastName: "Last Name",
  farmerStreet: "Street",
  farmerHouseNumber: "House Number",
  farmerPostalCode: "Postal Code",
  farmerCity: "City",
  farmerPhoneNumber: "Phone Number",
  vetTitle: "Veterinary Title",
  vetFirstName: "First Name",
  vetLastName: "Last Name",
  vetStreet: "Street",
  vetHuseNumber: "House Number",
  vetPostalCode: "Postal Code",
  vetCity: "City",
  signatureVetenary: "Veterinary Signature",
  signatureFarmer: "Farmer Signature",

};


const Filter = ({
  onFilterSubmit,
}: {
  onFilterSubmit: (
    selectedTable: string,
    selectedAttribute: string,
    inputValue: string
  ) => void;
}) => {
  const [openFirstFilter, setOpenFirstFilter] = React.useState(false);
  const [openSecondFilter, setOpenSecondFilter] = React.useState(false);
  const [openInputFilter, setOpenInputFilter] = React.useState(false);
  const [selectedTable, setSelectedTable] = React.useState(initialSelectedTable);
  const [selectedAttribute, setSelectedAttribute] = React.useState( initialSelectedAttribute);
  const [tableNames, setTableNames] = React.useState<{ name: string }[]>([]);
  const [fieldNames, setFieldNames] = React.useState<{ name: string }[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [secondMenuVisible, setSecondMenuVisible] = React.useState(false);
  const [appliedFilters, setAppliedFilters] = React.useState<{table: string, attribute: string; value: string }[]>([]);

  const handleOpenFirstFilter = async () => {
    setOpenFirstFilter(!openFirstFilter);

    getAllTableNamess()
      .then((data) => {
        setTableNames(data);
      })
      .catch((error) => {
        console.error("Error fetching table names:", error);
      });
  };

  const handleOpenSecondFilter = async () => {
    setOpenSecondFilter(!openSecondFilter);
    setOpenInputFiler(!openInputFilter);

    getAllFields(selectedTable)
      .then((data) => {
        setFieldNames(data);
      })
      .catch((error) => {
        console.error("Error fetching table names:", error);
      });
  };

  const handleButtonInFirstFilter = async (
    buttonText: React.SetStateAction<string>
  ) => {
    setSelectedTable(buttonText);
    setOpenFirstFilter(false);
    setSecondMenuVisible(true);
  };

  const handleButtonInSecondFilter = (
    buttonText: React.SetStateAction<string>
  ) => {
    setSelectedAttribute(buttonText);
    setOpenSecondFilter(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleFilterClick = () => {
    if (selectedTable !== "Table ID" && selectedAttribute && inputValue) {    
      onFilterSubmit(selectedTable, selectedAttribute, inputValue);
      setSecondMenuVisible(false);
      setOpenInputFiler(false);
      setSelectedTable("Table ID");
      setSelectedAttribute("");
      setInputValue("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleResetClick = () => {
    onFilterSubmit("", "", "");
    setSecondMenuVisible(false);
    setOpenInputFiler(false);
    setSelectedTable("Table ID");
    setSelectedAttribute("");
    setInputValue("");
    setAppliedFilters([]);
  };

  return (
    <>
      <div className="filter-container">
        <div className="dropdown">
          <button className="menu-button" onClick={handleOpenFirstFilter}>
            {selectedTable}
          </button>
          {openFirstFilter ? (
            <ul className="menu">
              {tableNames.map((table, index) => {
                let displayText = nameDictionary[table.name];
                return (
                  <li key={index} className="menu-item">
                    <button
                      className="menu-button"
                      onClick={() => handleButtonInFirstFilter(table.name)}
                    >
                      {displayText}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        {secondMenuVisible && (
          <div className="dropdown">
            <button className="menu-button" onClick={handleOpenSecondFilter}>
              {selectedAttribute || selectedTable}
            </button>
            {openSecondFilter ? (
              <ul className="menu">
                {fieldNames.map((field, index) => (
                  <li key={index} className="menu-item">
                    <button
                      className="menu-button"
                      onClick={() => handleButtonInSecondFilter(field.name)}
                    >
                      {nameDictionary[field.name]}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}

        {selectedTable !== "Table ID" &&
          selectedAttribute &&
          openInputFilter && (
            <div className="input-field-container">
              <input
                id="inputField"
                className="input-field"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your filter text"
              />
              <button className="input-button" onClick={handleFilterClick}>
                Filter
              </button>
             
            </div>
          )}
      </div>
      
        <div className="appliedFilters-container">
          <h3>Applied Filters</h3>
          <ul className="appliedFilters-list">
            {appliedFilters.map((filter, index) => (
              <li key={index}>
                Attribute: {filter.attribute}, Value: {filter.value}
              </li>
            ))}
          </ul>
          <button className="input-button" onClick={handleResetClick}>
            Reset
          </button>
        </div>
      
    </>
  );
};

export default Filter;
