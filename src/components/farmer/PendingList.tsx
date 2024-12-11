import React, { useState, useEffect } from 'react';
import fetchRegexData from '../../utils/WavesRegexFetch'  
import { nodeInteraction } from "@waves/waves-transactions";
import useStore from '../../store';

const Pending_List: React.FC = () => {
  const [pendingEntries, setPendingEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // brauchen wir das???
  
  //const current_table_reference = useStore((state) => state.current_table_reference);
  const set_current_table_reference = useStore((state) => state.set_current_table_reference);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
          let accountdata = JSON.parse(localStorage.getItem("keeperWalletPublicState"))
          let key = "associated_veterinary_office";
          const farmerWalletadress = accountdata.account.address;
          const nodeUrl = accountdata.network.server;
          const walletAddress_vet_office = (await nodeInteraction.accountDataByKey(key,farmerWalletadress, nodeUrl )).value
          console.log(walletAddress_vet_office)
          key = farmerWalletadress+"_pending"

          const data = await nodeInteraction.accountDataByKey(key,walletAddress_vet_office, nodeUrl )
          setPendingEntries(data.value.split(","));

      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
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
    let reference = JSON.parse(localStorage.getItem("keeperWalletPublicState")).account.address+"_"+entry+"_F";
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
