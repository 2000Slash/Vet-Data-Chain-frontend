import { useEffect, useState } from "react";
import Header from "../components/shared_components/Header";
import Table from "../components/shared_components/Table";
import Report from "../components/veterinary_office/Report";
import Loading from "../components/shared_components/Loading";
import { loadAllVetOfficeData } from "../utils/utils";
import { filterDatabase, getAntibioticSummary } from "../utils/sqlRequests";
import Filter from "../components/shared_components/Filter";
import "../styles/details/VetenaryOfficePage.css"

const Vetenary_office_Page = () => {
  const [tableData, setTableData] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [laoding, setLoading] = useState<boolean>(false);
  const [tableValue, setTableValue] = useState("Table");
  const [attributeValue, setAttributeValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [buttonStatus, setButtonStatus] = useState<boolean[]>([false]);
  const [visibleReport, setVisibleReport] = useState(false)

  type FilterType = {
    table: string;
    attribute: string;
    value: string;
  };
  const [filters, setFilters] = useState<FilterType[]>([]);

  const handleFilterSubmit = async (
    selectedTable: string,
    selectedAttribute: string,
    inputValue: string,
    filterIndex: number
  ) => {
    if (selectedTable && selectedAttribute && inputValue) {
      const additionalFilter: FilterType = [
        selectedTable,
        selectedAttribute,
        inputValue,
      ];
      console.log("Index filter added:", filterIndex);
      const updatedFilter = [...filters, additionalFilter];
      setFilters(updatedFilter);
      const updatedButtonStatus = [...buttonStatus];

      updatedButtonStatus[filterIndex] = true;

      if (filterIndex + 1 !== buttonStatus.length) {
        updatedButtonStatus.push(false);
      }
      setButtonStatus(updatedButtonStatus);
      console.log("Neuerrrr Filter", updatedFilter);
      console.log("Neuer Buttonstatus:", updatedButtonStatus);
    } else {
      alert("Bitte füllen Sie alle Felder aus.");
    }
  };

  const handleApplyFilters = async () => {
    if (filters.length > 0) {
      console.log("Alle Filter:", filters);
      const dataForTable = await filterDatabase("aadRecords", filters);
      setTableData(dataForTable);
      getAntibioticSummary(filters)
        .then((data) => {
          setReportData(data);
        })
        .catch((error) => {
          console.error("Fehler beim Abrufen der gefilterten Daten:", error);
        });
    } else {
      alert("Keine Filter angewendet.");
    }
  };

  const handleRemoveFilter = (index: number) => {
    console.log("Remove filter starts");
    console.log("Old filter", filters);
    console.log("Index for remove", index);
    const updatedFilters = filters.filter((_, i) => i !== index);
    console.log("New filter", updatedFilters);
    setFilters(updatedFilters);

    const updatedButtonStatus = [...buttonStatus];

    if (updatedButtonStatus[index] === true) {
      updatedButtonStatus[index] = false;
    }
    setButtonStatus(updatedButtonStatus);
    console.log("New button status", updatedButtonStatus);

    if (updatedFilters.length === 0) {
      setTableValue("Table ID");
      setAttributeValue("");
      setTextValue("");
    }
  };

  const handleResetButton = async () => {
    setFilters([]);
    setTableValue("Table ID");
    setAttributeValue("");
    setTextValue("");
    setResetKey((prevKey) => prevKey + 1);
    setButtonStatus([]);
    setLoading(true);

    try {
      const dataForTable = await filterDatabase("aadRecords", []);
      const summaryData = await getAntibioticSummary([]);

      setTableData(dataForTable);
      setReportData(summaryData);
    } catch (error) {
      console.error("Fehler beim Zurücksetzen der Daten:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadAllVetOfficeData();
        const dataForTable = await filterDatabase("aadRecords", []);
        getAntibioticSummary([])
          .then((data) => {
            setReportData(data);
          })
          .catch((error) => {
            console.error("Fehler beim Abrufen der gefilterten Daten:", error);
          });
        setTableData(dataForTable);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vet office data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header role="Veterinary Office" />
      <div>
        <div className="containerfilter">
          <Filter
            key={resetKey}
            onFilterSubmit={handleFilterSubmit}
            initialSelectedTable={tableValue}
            initialSelectedAttribute={attributeValue}
            initialInputValue={textValue}
            isAdded={filters.length > 0 && filters[0].table !== "Table ID"}
            onRemoveFilter={handleRemoveFilter}
            filterIndex={0}
            isDisabled={buttonStatus[0]}
          />
        </div>

        {filters.length > 0 &&
          filters.map((filter, index) => (
            <div key={index}>
              <Filter
                onFilterSubmit={handleFilterSubmit}
                initialSelectedTable={filter.table}
                initialSelectedAttribute={filter.attribute}
                initialInputValue={filter.value}
                filterIndex={index + 1}
                onRemoveFilter={handleRemoveFilter}
                isAdded={buttonStatus[index + 1]}
                isDisabled={buttonStatus[index + 1]}
              />
            </div>
          ))}
      </div>
      <div className="containerfilter">
        <button className="input-button function " onClick={handleApplyFilters}>
          Apply Filter
        </button>
        <button  className="input-button function" onClick={handleResetButton}>
          Reset
        </button>
      </div>
      <div>
        {laoding ? (
          <Loading />
        ) : tableData ? (
          <>
            <Table jsonData={tableData} />
            <Report
              tabNames={["Antibiotic stats", "Other Menu 1", "Other Menu 2"]}
              jsonData={[reportData, ,]}
            />
          </>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default Vetenary_office_Page;