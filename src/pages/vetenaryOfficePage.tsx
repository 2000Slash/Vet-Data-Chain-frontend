import { useEffect, useState } from "react";
import Header from "../components/shared_components/Header";
import Table from "../components/shared_components/Table";
import Report from "../components/veterinary_office/report";
import Loading from "../components/shared_components/Loading";
import { loadAllVetOfficeData } from "../utils/utils";
import { filterDatabase, getAntibioticSummary } from "../utils/sqlRequests";
import Filter from "../components/shared_components/Filter";

const Vetenary_office_Page = () => {
  const [tableData, setTableData] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [laoding, setLoading] = useState<boolean>(false);
  const [tableValue, setTableValue] = useState("Table ID");
  const [attributeValue, setAttributeValue] = useState("");
  const [textValue, setTextValue] = useState("");

  type FilterType = {
    table: string;
    attribute: string;
    value: string;
  };
  const [filters, setFilters] = useState<FilterType[]>([]);
  

  const handleFilterSubmit = async (
    selectedTable: string,
    selectedAttribute: string,
    inputValue: string
  ) => {
    if (selectedTable && selectedAttribute && inputValue) {
      const additionalFilter: FilterType = [
        selectedTable,
        selectedAttribute,
        inputValue,
      ];
      const updatedFilter = [...filters, additionalFilter];
      setFilters(updatedFilter);
      console.log("Neuer Filter", updatedFilter);
    } else {
      alert("Bitte füllen Sie alle Felder aus.");
    }
  };

  useEffect(() => {
    console.log("Aktuelle Filter:", filters);
  }, [filters]);

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

  const handleResetButton = async () => {
    setFilters([]);
    setTableValue("Table ID");
    setAttributeValue("");
    setTextValue("");
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
        <div>
          <Filter
            onFilterSubmit={handleFilterSubmit}
            initialSelectedTable= {tableValue}
            initialSelectedAttribute= {attributeValue}
            initialInputValue= {textValue}
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
              />
            </div>
          ))}
      </div>
      <div>
        <button className="input-button" onClick={handleApplyFilters}>
          Apply Filter
        </button>
        <button className="input-button" onClick={handleResetButton}>
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
              tabNames={["Antibiotic stats", "Other Menu 1", "Other Menu2"]}
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
