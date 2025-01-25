import { useState, useEffect } from 'react';
import { getKeeperWalletPublicKey ,    getMyVenearyPublicKey , getPendingAaDList, getAaDRecord,  decodeMessage, parseEntryToObject} from '../../utils/utils'  
import Table from '../shared_components/Table';

interface InfoBoxData {
  title: string;
  content: string;
}

const Pending_List: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEntries, setPendingEntries] = useState<string[]>([]);
  const [jsonData, setJsonData] = useState<any>(null);


  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let pendingListAsString = await getPendingAaDList();
        
        setPendingEntries((await pendingListAsString).split(","));
      } catch (err: any) {
        console.log(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const loadPendingAuA = async (entry: string) => {
    try {
      let title = `Pending Entry #${entry}`;
      let pubKeyFarmer = await getKeeperWalletPublicKey();
      let requestKey = pubKeyFarmer + "_" + entry;
      let encodedData = String(await getAaDRecord(requestKey));
      const vetenaryPublicKey = await getMyVenearyPublicKey(requestKey);
      let decodedData = await decodeMessage(encodedData, vetenaryPublicKey);
      //let tabledata = await filterDatabase("aadRecords", [["aadRecords", selectedAttribute, inputValue]])
      let jsonString = [await parseEntryToObject(decodedData)];
      setJsonData(jsonString);
      setInfoBoxData({
        title: title,
        content: decodedData,
      });
    } catch (error) {
      console.error("Error loading pending AuA:", error);
      setInfoBoxData({
        title: "Error",
        content:
          "An error occurred while loading the pending entry. Please try again.",
      });
    }
  };

  return (
    <div>
      <div className='pendingListContainer'>
      {pendingEntries.length === 0 ? (
        <p>No key-value pairs found.</p>
      ) : (
        <ul >
            {pendingEntries.map((entry, index) => (
                <li key={index}>
                <button onClick={() => loadPendingAuA(entry)}>Entry {index + 1}</button>
                </li>
            ))}
        </ul>
      )}
      </div>
      {jsonData && <Table jsonData={jsonData}/>}
    </div>
  );
};

export default Pending_List;