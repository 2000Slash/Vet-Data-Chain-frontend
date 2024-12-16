import { address, base58Encode } from '@waves/ts-lib-crypto';
import { nodeInteraction } from '@waves/waves-transactions';
import { libs } from "@waves/waves-transactions";
import axios from 'axios';

function customEncodeURIComponent(str: string): string {
    return encodeURIComponent(str)
        .replace(/\*/g, '%2A') // Encode '*'
        .replace(/\^/g, '%5E') // Encode '^'
        .replace(/\$/g, '%24'); // Encode '$' Nils zeigen wie er ohne das macht
}

export async function fetchRegexData(nodeURL: string, walletAddress: string, regex: string) {
  try {
      const response = await axios.get(`${nodeURL}/addresses/data/${walletAddress}`, {
          params: {
              matches: regex,
          },
          headers: {
              'accept': 'application/json',
          },
      });
    return String(response.data); 
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
  
  export async function keeperWalletEncrypt(): Promise<string> {
    try {
      const state = await KeeperWallet.publicState();
      const privateKey = state.account?.privateKey;
      if (!privateKey) {
        throw new Error('Private key is null or undefined.');
      }
      return String(privateKey);
    } catch (error) {
      console.error('Error fetching private key:', error);
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


  export async function getPublicKeyVeterinaryOffice(): Promise<string> {
    const baseURL = await getKeeperWalletURL();
    const address = await getKeeperWalletAddress();
    const limit = 1;
    try {
      const response = await axios.get(`${baseURL}transactions/address/${address}/limit/${limit}`, {
          headers: {
              'accept': 'application/json',
          },
      });

      return response.data; 
  } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error; 
  }
}

export async function getPendingAaDList(): Promise<string>{
  try {
            const farmerWalletadress = await getKeeperWalletAddress();
            const farmerWalletPublicKey = await getKeeperWalletPublicKey();
            const nodeUrl = await getKeeperWalletURL();
            const pubKey_vet_office = (await nodeInteraction.accountDataByKey("publicKeyVetOffice",farmerWalletadress,nodeUrl)).value
            const walletAddress_vet_office = address({publicKey: pubKey_vet_office}, 'T'); 
            const key = farmerWalletPublicKey+"_pending"
  
            const data = await nodeInteraction.accountDataByKey(key,walletAddress_vet_office, nodeUrl )
            return data.value
  
        } catch (err: any) {
          console.log(err.message || 'An unknown error occurred');
        } 

}

export async function getAaDRecord(aaDKey:string) {
  try {
            const farmerWalletadress = await getKeeperWalletAddress();
            const nodeUrl = await getKeeperWalletURL();
            const pubKey_vet_office = (await nodeInteraction.accountDataByKey("publicKeyVetOffice",farmerWalletadress,nodeUrl)).value
            const walletAddress_vet_office = address({publicKey: pubKey_vet_office}, 'T'); 
            const data = await nodeInteraction.accountDataByKey(aaDKey,walletAddress_vet_office, nodeUrl )
            return data.value
          } catch (err: any) {
            console.log(err.message || 'An unknown error occurred');
          } 
            
}
/**
export async function decodeMessage(encryptedMessage: string, senderPublicKey: string) {
  console.log(encryptedMessage)
  console.log(senderPublicKey)
  console.log("Calling decodeMessage function...");
  senderPublicKey = "GLUBVaLEFpqYfXtvsykcswF7TMLChVifJ97Fn91Jexe7"
    const context = "waves";
  try {
    console.log("we are in the try block")
    const message = await KeeperWallet.decryptMessage(
      String(encryptedMessage),
      senderPublicKey,
      context
    );
    console.log(message);
    return message;
  } catch (error) {
    console.error('Error decoding message:', error);
    throw error; 
  }
}*/

export async function decodeMessage(encryptedMessage: string, senderPublicKey: string){
  try {
    console.log("Starting decryption...");

    const receiverPrivateKey = "1gvsUBKFPrjmR9RkWgLiVEY5rjMAuaBYHkT7sW4rTUu";
    senderPublicKey = "GLUBVaLEFpqYfXtvsykcswF7TMLChVifJ97Fn91Jexe7"
    const context = "waves";

    const sharedKey = libs.crypto.sharedKey(
      receiverPrivateKey, 
      senderPublicKey, 
      context
    );

    console.log("Shared Key:", sharedKey);

    const decryptedMessage = libs.crypto.messageDecrypt(sharedKey, encryptedMessage);

    console.log("Decrypted Message:", decryptedMessage);
    return decryptedMessage;
  } catch (error) {
    console.error("Error decoding message:", error);
    throw error;
  }
};


export default fetchRegexData;