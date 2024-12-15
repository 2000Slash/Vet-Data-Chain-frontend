import { useState, useEffect } from 'react';
import { getKeeperWalletPublicKey , getKeeperWalletAddress , getKeeperWalletURL, getPublicKeyVeterinaryOffice, calculateWavesAddress, getPendingAaDList, getAaDRecord, getKeeperWalletPrivateKey, decodeMessage} from '../../utils/utils'  
import { nodeInteraction , libs} from "@waves/waves-transactions";
import { address, keyPair, base58Encode, base58Decode, ChaidId , aesDecrypt} from '@waves/ts-lib-crypto';
import useStore from '../../store';
import InfoBox_Text from '../login/infobox';

const Pending_List: React.FC = () => {
  const [pendingEntries, setPendingEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // brauchen wir das???

  const setInfoBoxData = useStore((state) => state.setInfoBoxData);
  const infoBoxData = useStore((state) => state.infoBoxData);
  
  const set_current_table_reference = useStore((state) => state.set_current_table_reference);

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
    let title = `Pending Entry #${entry}`
    let pubKeyFarmer = await getKeeperWalletPublicKey()
    let requestKey = pubKeyFarmer+"_"+entry
    let encodedData = String(await getAaDRecord(requestKey))
    let farmerWalletadress = String(await getKeeperWalletAddress())
    let nodeUrl = String(await getKeeperWalletURL())
    const pubKey_vet_office= String((await nodeInteraction.accountDataByKey("publicKeyVetOffice",farmerWalletadress,nodeUrl)).value)
    const pubKey_vet_officeA = String(await (nodeInteraction.accountDataByKey("publicKeyVetOffice",farmerWalletadress,nodeUrl)).value)
    let decodedData = await decodeMessage(encodedData, pubKey_vet_office);
    console.log("Decrypted Data:", decodedData);
    setInfoBoxData({
      title: title,
      content: decodedData,
    });

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
