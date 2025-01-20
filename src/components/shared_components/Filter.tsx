import * as React from "react";
import "../../styles/details/Filter.css";
import { getAllTableNamess, getAllFields } from "../../utils/sqlRequests";

const Filter = ({
  onFilterSubmit,
  initialSelectedTable = "Table ID",
  initialSelectedAttribute = "",
  initialInputValue = "",
}: {
  onFilterSubmit: (
    selectedTable: string,
    selectedAttribute: string,
    inputValue: string
  ) => void;
  initialSelectedTable?: string;
  initialSelectedAttribute?: string;
  initialInputValue?: string;
}) => {
  const [openFirstFilter, setOpenFirstFilter] = React.useState(false);
  const [openSecondFilter, setOpenSecondFilter] = React.useState(false);
  const [openInputFilter, setOpenInputFilter] = React.useState(false);
  const [selectedTable, setSelectedTable] = React.useState(initialSelectedTable);
  const [selectedAttribute, setSelectedAttribute] = React.useState(initialSelectedAttribute);
  const [tableNames, setTableNames] = React.useState<{ name: string }[]>([]);
  const [fieldNames, setFieldNames] = React.useState<{ name: string }[]>([]);
  const [inputValue, setInputValue] = React.useState(initialInputValue);
  const [secondMenuVisible, setSecondMenuVisible] = React.useState(false);
  //const [appliedFilters, setAppliedFilters] = React.useState<{table: string, attribute: string; value: string }[]>([]);

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
    setOpenInputFilter(!openInputFilter);

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
      console.log("Werte:",selectedTable,selectedAttribute,inputValue); 
      console.log("Zustandswerte:",openFirstFilter, openSecondFilter, openInputFilter, secondMenuVisible);
      onFilterSubmit(selectedTable, selectedAttribute, inputValue);
      
    } else {
      alert("Please fill in all fields.");
    }
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
              {tableNames.map((table, index) => (
                <li key={index} className="menu-item">
                  <button
                    className="menu-button"
                    onClick={() => handleButtonInFirstFilter(table.name)}
                  >
                    {table.name}
                  </button>
                </li>
              ))}
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
                      {field.name}
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
              <button className="add-button" onClick={handleFilterClick}>
                +
              </button>
             
            </div>
          )}
      </div>  
    </>
  );
};

export default Filter;
