import { useState, useEffect } from 'react';
import { getKeeperWalletPublicKey ,    getMyVenearyPublicKey , getPendingAaDList, getAaDRecord,  decodeMessage} from '../../utils/utils'  
import useStore from '../../store';
import InfoBox_Text from '../login/infobox';

interface InfoBoxData {
  title: string;
  content: string;
}


const Pending_List: React.FC = () => {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEntries, setPendingEntries] = useState<string[]>([]);
  
  
  const [infoBoxData, setInfoBoxData]  = useState<InfoBoxData>({title: '', content: ''});


  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
          let pendingListAsString = getPendingAaDList()
          setPendingEntries((await pendingListAsString).split(","));
      } catch (err: any) {
        console.log(err.message || 'An unknown error occurred');
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
      const vetenaryPublicKey = await getMyVenearyPublicKey(requestKey)
      let decodedData = await decodeMessage(encodedData, vetenaryPublicKey);
      console.log("Decrypted Data:", decodedData);
      setInfoBoxData({
        title: title,
        content: decodedData,
      });
    } catch (error) {
      console.error("Error loading pending AuA:", error);
      setInfoBoxData({
        title: "Error",
        content: "An error occurred while loading the pending entry. Please try again.",
      });
    }
  };
  
  return (
    <div>
      <h2>Pending AaD entries</h2>
      {pendingEntries.length === 0 ? (
        <p>No key-value pairs found.</p>
      ) : (
        <ul>
            {pendingEntries.map((entry, index) => (
                <li key={index}>
                <strong>Entry {index + 1}:</strong> <button onClick={() => loadPendingAuA(entry)}>{entry}</button>
                </li>
            ))}
        </ul>
      )}
      {infoBoxData && <InfoBox_Text title={infoBoxData.title} content={infoBoxData.content} />}
    </div>
  );
};

export default Pending_List;