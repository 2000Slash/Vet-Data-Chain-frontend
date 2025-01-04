import { address} from '@waves/ts-lib-crypto';
import { nodeInteraction } from '@waves/waves-transactions';
import axios from 'axios';


const vetOfficeAddress = "3NAvjkBp1pj8NdijCectFXyAVNQ3AjFeDBK"
const vetOfficepubKey = "DXRAtrqCCryKgeoCy7ECy5fsRCpn7RtpoCGDdUPAm9Nx"

export async function fetchRegexData(nodeURL: string, walletAddress: string, regex: string) {

  try {
      const response = await axios.get(`${nodeURL}addresses/data/${walletAddress}`, {
          params: {
              matches: regex,
          },
          headers: {
              'accept': 'application/json',
          },
      });
    return response; 
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

export async function getMyRole(){
  let key = await getKeeperWalletPublicKey()+ "_role"
  let address = vetOfficeAddress;
  let nodeUrl = await getKeeperWalletURL()
  let role = await nodeInteraction.accountDataByKey(key, address, nodeUrl);
  return role?.value
}

export async function getKeeperWalletAddress(): Promise<string> {
    try {
      const state = await KeeperWallet.publicState();
      const address = state.account?.address;
      if (!address) {
        throw new Error('Wallet address is null or undefined.');
      }
      return String(address);
    } catch (error) {
      console.error('Error fetching wallet address:', error);
      throw error;
    }
  }
  
  export async function getKeeperWalletPublicKey(): Promise<string> {
    try {
      const state = await KeeperWallet.publicState();
      const publicKey = state.account?.publicKey;
      if (!publicKey) {
        throw new Error('Public key is null or undefined.');
      }
      return String(publicKey);
    } catch (error) {
      console.error('Error fetching public key:', error);
      throw error;
    }
  }
  
  
  export async function getKeeperWalletURL(): Promise<string> {
    try {
      const state = await KeeperWallet.publicState();
      const nodeUrl = state.network?.server;
      if (!nodeUrl) {
        throw new Error('Node URL is null or undefined.');
      }
      return String(nodeUrl);
    } catch (error) {
      console.error('Error fetching URL:', error);
      throw error;
    }
  }
  
  export async function getKeeperWalletNetworkLetter(): Promise<string> {
    try {
      const state =  await KeeperWallet.publicState();
      const network = state.network;
      if (!network) {
        throw new Error('Network letter is null or undefined.');
      }
      return String(network);
    } catch (error) {
      console.error('Error fetching network letter:', error);
      throw error;
    }
  }


  export function getPublicKeyVeterinaryOffice(): string {
    return vetOfficepubKey
}

export async function getPendingAaDList(): Promise<string>{
  try {
            const farmerWalletPublicKey = await getKeeperWalletPublicKey();
            const nodeUrl = await getKeeperWalletURL();
            const pubKey_vet_office = getPublicKeyVeterinaryOffice();
            const walletAddress_vet_office = address({publicKey: pubKey_vet_office}, 'T'); 
            const key = farmerWalletPublicKey+"_pending"
            const data = await nodeInteraction.accountDataByKey(key,walletAddress_vet_office, nodeUrl )
            return String(data?.value);
        } catch (err: any) {
          console.log(err.message || 'An unknown error occurred');
          return '';
        } 
        
}

export async function getAaDRecord(aaDKey:string): Promise<string> {
  try {
            const nodeUrl = await getKeeperWalletURL();
            const data = await nodeInteraction.accountDataByKey(aaDKey,vetOfficeAddress, nodeUrl )
            return String(data?.value);
          } catch (err: any) {
            console.log(err.message || 'An unknown error occurred');
            return ''
          } 
}

export async function decodeMessage(encryptedMessage: string, senderPublicKey: string): Promise<string>{
  const context = ""; 
  
  try {
    const message = await KeeperWallet.decryptMessage(
      encryptedMessage,    // The encrypted data (base58 string)
      senderPublicKey,     // The sender's public key (base58 string)
      context              // The prefix used during encryption (important keeper wallets adds automatically the word "waves" to any prefix)
    );
    return message;
  } catch (error) {
    throw error;
  }
}

export async function getMyVenearyPublicKey(aaDEntryKey: String) {
  let aaDEntryKeyAsArray = aaDEntryKey.split("_")
  const regexString = `^${aaDEntryKeyAsArray[0]}_.*_${aaDEntryKeyAsArray[1]}$`;
  console.log(regexString)
  const fetchedData = await fetchRegexData(await getKeeperWalletURL(),vetOfficeAddress,regexString)
  let vetenaryEntryArray = fetchedData?.data[0].key.split("_");
  return vetenaryEntryArray[1]
}

export async function entryStringToJson(incomingEntry: string) {
  const segments = incomingEntry.split(';');
  let signatures = [];
  let vetData = [];
  let farmerData = [];
  let aadRecords = [];
  let dateOfIssue = "";


  signatures = segments[0].split(',');
  vetData = segments[1].split(',');
  farmerData = segments[2].split(',');


  for (let i = 3; i < segments.length; i++) {
    const currentSegment = segments[i];

    if (!isNaN(Date.parse(currentSegment))) {
      dateOfIssue = currentSegment;
      break;
    } else {
      aadRecords.push(currentSegment);
    }
  }

  return {
    Signatures: signatures,
    ContactDataVeterinary: vetData,
    ContactDataFarmer: farmerData,
    AaDRecords: aadRecords,
    DateOfIssue: dateOfIssue,
  };
}


