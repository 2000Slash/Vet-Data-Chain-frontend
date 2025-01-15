import { useState, useEffect } from 'react';
import { getKeeperWalletPublicKey ,    getMyVenearyPublicKey , getPendingAaDList, getAaDRecord,  decodeMessage, entryStringToJson} from '../../utils/utils'  
import useStore from '../../store';
import InfoBox_Text from '../login/infobox';
import Table from '../shared_components/Table';

interface InfoBoxData {
  title: string;
  content: string;
}

const Pending_List: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEntries, setPendingEntries] = useState<string[]>([]);
  const [infoBoxData, setInfoBoxData]  = useState<InfoBoxData>({title: '', content: ''});
  const [jsonData, setJsonData] = useState<any>(null);


  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let pendingListAsString = getPendingAaDList();
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
      console.log("Decrypted Data:", decodedData);
      let jsonString = [await entryStringToJson(decodedData)];
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
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{minWidth: '200px', backgroundColor: '#d9d9d9', padding: '15px', height: '100vh'}} className='pendingListContainer'>
      {pendingEntries.length === 0 ? (
        <p>No key-value pairs found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {pendingEntries.map((entry, index) => (
                <li key={index} style={{ marginTop: '10px' }}>
                <button style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#d9d9d9',
                    color: 'black',
                    border: 'none',               
                    cursor: 'pointer',
                    fontSize: '20px'
                  }} onClick={() => loadPendingAuA(entry)}>Entry {index + 1}</button>
                </li>
            ))}
        </ul>
      )}
      </div>
      {/*infoBoxData && <InfoBox_Text title={infoBoxData.title} content={infoBoxData.content} />*/}
      {jsonData && <Table jsonData={jsonData}/>}
    </div>
  );
};

export default Pending_List;
