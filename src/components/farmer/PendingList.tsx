import { useState, useEffect } from 'react';
import { getKeeperWalletPublicKey , getKeeperWalletAddress , getKeeperWalletURL, getPublicKeyVeterinaryOffice} from '../../utils/utils'  
import { nodeInteraction } from "@waves/waves-transactions";
import { address, base58Encode, base58Decode } from '@waves/ts-lib-crypto';
import useStore from '../../store';

const Pending_List: React.FC = () => {
  const [pendingEntries, setPendingEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // brauchen wir das???
  
  const set_current_table_reference = useStore((state) => state.set_current_table_reference);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
          const farmerWalletadress = await getKeeperWalletAddress();
          const farmerWalletPublicKey = await getKeeperWalletPublicKey();
          const nodeUrl = await getKeeperWalletURL();
          const pubKey_vet_office = (await nodeInteraction.accountDataByKey("publicKeyVetOffice",farmerWalletadress,nodeUrl)).value
          const walletAddress_vet_office = address(pubKey_vet_office, 'T'); //HELP HELP HELP HELP HELP HELP HELP HELP HELP HELP HELP HELP HELP HELP HELP HELP
          console.log(walletAddress_vet_office)
          const key = farmerWalletPublicKey+"_pending"

          const data = await nodeInteraction.accountDataByKey(key,farmerWalletadress, nodeUrl )
          setPendingEntries(data.value.split(","));

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

  const loadPendingAuA = (entry: string) => {
    console.log(`Button clicked for entry: ${entry}`);
    let reference = JSON.parse(getKeeperWalletPublicKey()+"_"+entry+"_F");
    set_current_table_reference(reference);
    alert(`You clicked on: ${useStore.getState().current_table_reference}`);
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
    </div>
  );
};

export default Pending_List;
