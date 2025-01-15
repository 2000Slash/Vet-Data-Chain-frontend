import * as React from "react";
import "../../styles/details/Filter.css";

const Filter = () => {
  const [openFirstFilter, setOpenFirstFilter] = React.useState(false);
  const [openSecondFilter, setOpenSecondFilter] = React.useState(false);
  const [selectedTable, setSelectedTable] = React.useState("Table ID");
  const [selectedAttribute, setSelectedAttribute] =React.useState("");
  const [secondMenuVisible, setSecondMenuVisible] = React.useState(false);

  const handleOpenFirstFilter = () => {
    setOpenFirstFilter(!openFirstFilter);
  };

  const handleOpenSecondFilter = () => {
    setOpenSecondFilter(!openSecondFilter);
  }

  const handleButtonInFirstFilter = (
    buttonText: React.SetStateAction<string>
  ) => {
    setSelectedTable(buttonText);
    setOpenFirstFilter(false);
    setSecondMenuVisible(true);
  };

  const handleButtonInSecondFilter = (buttonText: React.SetStateAction<string>) => {
    setSelectedAttribute(buttonText);
    setOpenSecondFilter(false);
  };

  const renderSecondMenu = () => {
    if (selectedTable === "AaD Records") {
      return (
        <ul className="menu">
          <li className="menu-item">
            <button className="menu-button" onClick={() => handleButtonInSecondFilter("Animal ID")}>Animal ID</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Species</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Diagnosis</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Diagnosis Date</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Medication Name</button>
          </li>
        </ul>
      );
    } else if (selectedTable === "contactDataFarmer") {
      return (
        <ul className="menu">
          <li className="menu-item">
            <button className="menu-button">First Name</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Second Name</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Street</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Postal Code</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">City</button>
          </li>
        </ul>
      );
    } else if (selectedTable === "contactDataVeterinary") {
      return (
        <ul className="menu">
          <li className="menu-item">
            <button className="menu-button">First Name</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Second Name</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Street</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">Postal Code</button>
          </li>
          <li className="menu-item">
            <button className="menu-button">City</button>
          </li>
        </ul>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="filter-container">
      <div className="dropdown">
        <button className="menu-button" onClick={handleOpenFirstFilter}>
          {selectedTable}
        </button>
        {openFirstFilter ? (
          <ul className="menu">
            <li className="menu-item">
              <button
                className="menu-button"
                onClick={() => handleButtonInFirstFilter("AaD Records")}
              >
                AaD Records
              </button>
            </li>
            <li className="menu-item">
              <button
                className="menu-button"
                onClick={() => handleButtonInFirstFilter("contactDataFarmer")}
              >
                contactDataFarmer
              </button>
            </li>
            <li className="menu-item">
              <button
                className="menu-button"
                onClick={() =>
                  handleButtonInFirstFilter("contactDataVeterinary")
                }
              >
                contactDataVeterinary
              </button>
            </li>
          </ul>
        ) : null}
      </div>

      {secondMenuVisible && (
        <div className="dropdown">
          <button className="menu-button" onClick={handleOpenSecondFilter}>{selectedAttribute || selectedTable}</button>
          {openSecondFilter && renderSecondMenu()}
        </div>
      )}
    </div>
  );
};

export default Filter;
