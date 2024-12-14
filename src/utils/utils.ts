import axios from 'axios';
import bs58 from 'bs58';

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
    return response.data; 
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
      return address;
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
      return publicKey;
    } catch (error) {
      console.error('Error fetching public key:', error);
      throw error;
    }
  }
  
  export async function getKeeperWalletPrivateKey(): Promise<string> {
    try {
      const state = await KeeperWallet.publicState();
      const privateKey = state.account?.privateKey;
      if (!privateKey) {
        throw new Error('Private key is null or undefined.');
      }
      return privateKey;
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
      return nodeUrl;
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
      return network;
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


export default fetchRegexData;