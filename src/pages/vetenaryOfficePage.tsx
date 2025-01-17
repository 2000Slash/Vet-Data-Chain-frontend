import { useEffect, useState } from "react";
import Header from "../components/shared_components/Header";
import Table from "../components/shared_components/Table";
import Report from "../components/veterinary_office/report"
import Loading from "../components/shared_components/Loading";
import { loadAllVetOfficeData} from "../utils/utils";
import { filterDatabase, getAntibioticSummary } from "../utils/sqlRequests";
import Filter from "../components/shared_components/Filter";


const Vetenary_office_Page = () => {
  const [tableData, setTableData] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null)
  const [laoding, setLoading] = useState<boolean>(false);

  const handleFilterSubmit = async (selectedTable: string, selectedAttribute: string, inputValue: string) => {
    
    filterDatabase("aadRecords", [[selectedTable, selectedAttribute, inputValue]])
      .then((data) => {
        setTableData(data); 
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der gefilterten Daten:", error);
      });

      getAntibioticSummary([[selectedTable, selectedAttribute, inputValue]])
      .then((data) => {
        setReportData(data); 
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der gefilterten Daten:", error);
      });
    
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadAllVetOfficeData();
        const dataForTable = await filterDatabase("aadRecords",[])
        const antibioticData = await getAntibioticSummary([])
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
      <Filter onFilterSubmit={handleFilterSubmit}/>
      <div>
        {laoding ? (
          <Loading />
        ) : tableData ? (
          <>
            <Table jsonData={tableData} />
            <Report tabNames={["Antibiotic stats"]} jsonData={[reportData]}/>
          </>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default Vetenary_office_Page;
