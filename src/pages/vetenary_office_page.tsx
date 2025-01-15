import { useEffect, useState } from "react";
import Header from "../components/shared_components/Header";
import Table from "../components/shared_components/Table";
import Loading from "../components/shared_components/Loading";
import { loadAllVetOfficeData} from "../utils/utils";
import { filterDatabase } from "../utils/sql_requests";
import Filter from "../components/shared_components/Filter";

const Vetenary_office_Page = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [laoding, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadAllVetOfficeData();
        const data = await filterDatabase("aadRecords",[])
        setJsonData(data);
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
      <Filter/>
      <div>
        {laoding ? (
          <Loading />
        ) : jsonData ? (
          <>
            <Table jsonData={jsonData} />
          </>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default Vetenary_office_Page;
