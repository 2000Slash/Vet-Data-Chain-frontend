import { address, base58Decode} from '@waves/ts-lib-crypto';
import { nodeInteraction } from '@waves/waves-transactions';
import { libs } from "@waves/waves-transactions";
import axios from 'axios';
import {
   // base58 -> uInt8
  base58Encode, // uInt8 -> base58
  createSharedKey,
  decryptMessage,
  encryptMessage,
  createPrivateKey,
  createPublicKey,
  createAddress,
  utf8Encode, // string -> uInt8
  utf8Decode, // uInt8 -> String
} from "@keeper-wallet/waves-crypto";


const vetOfficeAddress = "3N3ZZJgQ6ob6xp2cJJx7bMqsYaiimq6d1YF"
const vetOfficepubKey = "7JyBiP5kR1ayLVXD9TdFTT79ArC9g8iBpdYXRBnLCmVH"
const vetPublicKey = "G1cF1XFqwsKVGnWqLNh9y3fWrcUwsemo5LaqfabHC2Ww"


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
            const farmerWalletadress = await getKeeperWalletAddress();
            const farmerWalletPublicKey = await getKeeperWalletPublicKey();
            const nodeUrl = await getKeeperWalletURL();
            const pubKey_vet_office = getPublicKeyVeterinaryOffice();
            const walletAddress_vet_office = address({publicKey: pubKey_vet_office}, 'T'); 
            const key = farmerWalletPublicKey+"_pending"
  
            const data = await nodeInteraction.accountDataByKey(key,walletAddress_vet_office, nodeUrl )
            return String(data.value)
  
        } catch (err: any) {
          console.log(err.message || 'An unknown error occurred');
        } 

}

export async function getAaDRecord(aaDKey:string) {
  try {
            const farmerWalletadress = await getKeeperWalletAddress();
            const nodeUrl = await getKeeperWalletURL();
            const pubKey_vet_office = (await nodeInteraction.accountDataByKey("publicKeyVetOffice",farmerWalletadress,nodeUrl)).value
            const walletAddress_vet_office = vetOfficeAddress
            const data = await nodeInteraction.accountDataByKey(aaDKey,walletAddress_vet_office, nodeUrl )
            return data.value
          } catch (err: any) {
            console.log(err.message || 'An unknown error occurred');
          } 
            
}

export async function decodeMessage(encryptedMessage: string, senderPublicKey: string) {
  const context = "vet-data-chain-"; 
  
  try {
    const message = await KeeperWallet.decryptMessage(
      encryptedMessage,    // The encrypted data (base58 string)
      senderPublicKey,     // The sender's public key (base58 string)
      context              // The prefix used during encryption
    );
    console.log("Decrypted message:", message);
    return message;
  } catch (error) {
    console.error("Error decoding message:", error);
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


