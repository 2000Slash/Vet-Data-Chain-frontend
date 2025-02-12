import { address } from "@waves/ts-lib-crypto";
import { nodeInteraction } from "@waves/waves-transactions";
import { getConnection } from "./database";
import { getAllTableNamess, getAllFields } from "./sqlRequests";
import { libs } from "@waves/waves-transactions";
import axios from "axios";


const vetOfficeAddress = "3N5dkUCjEV1XHmQo41oQknanomGGqp1AzYZ"
const vetOfficepubKey = "ExvXsx8QX6qdSegQwH1o9GD278rzMuqbtRQ6dYAvPvT5"
const vetOfficeSeed = "fresh zoo rural inflict gas absorb race deliver sister party task soup unfair prepare lab"
const recipientPrivateKey = libs.crypto.privateKey(vetOfficeSeed);

export async function fetchRegexData(
  nodeURL: string,
  walletAddress: string,
  regex: string
) {
  try {
    const response = await axios.get(
      `${nodeURL}addresses/data/${walletAddress}`,
      {
        params: {
          matches: regex,
        },
        headers: {
          accept: "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function getMyRole() {
  let key = (await getKeeperWalletPublicKey()) + "_role";
  let address = vetOfficeAddress;
  let nodeUrl = await getKeeperWalletURL();
  let role = await nodeInteraction.accountDataByKey(key, address, nodeUrl);
  return role?.value;
}

export async function getKeeperWalletAddress(): Promise<string> {
  try {
    const state = await KeeperWallet.publicState();
    const address = state.account?.address;
    if (!address) {
      throw new Error("Wallet address is null or undefined.");
    }
    return String(address);
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    throw error;
  }
}

export async function getKeeperWalletPublicKey(): Promise<string> {
  try {
    const state = await KeeperWallet.publicState();
    const publicKey = state.account?.publicKey;
    if (!publicKey) {
      throw new Error("Public key is null or undefined.");
    }
    return String(publicKey);
  } catch (error) {
    console.error("Error fetching public key:", error);
    throw error;
  }
}

export async function getKeeperWalletURL(): Promise<string> {
  try {
    const state = await KeeperWallet.publicState();
    const nodeUrl = state.network?.server;
    if (!nodeUrl) {
      throw new Error("Node URL is null or undefined.");
    }
    return String(nodeUrl);
  } catch (error) {
    console.error("Error fetching URL:", error);
    throw error;
  }
}

export async function getKeeperWalletNetworkLetter(): Promise<string> {
  try {
    const state = await KeeperWallet.publicState();
    const network = state.network;
    if (!network) {
      throw new Error("Network letter is null or undefined.");
    }
    return String(network);
  } catch (error) {
    console.error("Error fetching network letter:", error);
    throw error;
  }
}

export function getPublicKeyVeterinaryOffice(): string {
  return vetOfficepubKey;
}

export async function getPendingAaDList(): Promise<string> {
  try {
    const farmerWalletPublicKey = await getKeeperWalletPublicKey();
    const nodeUrl = await getKeeperWalletURL();
    const pubKey_vet_office = getPublicKeyVeterinaryOffice();
    const walletAddress_vet_office = address({ publicKey: pubKey_vet_office },"T");
    const key = farmerWalletPublicKey + "_pending";
    const data = await nodeInteraction.accountDataByKey(
      key,
      walletAddress_vet_office,
      nodeUrl
    );
    return String(data?.value);
  } catch (err: any) {
    console.error(err.message || "An unknown error occurred");
    return "";
  }
}

export async function getAaDRecord(aaDKey: string): Promise<string> {
  try {
    const nodeUrl = await getKeeperWalletURL();
    const data = await nodeInteraction.accountDataByKey(
      aaDKey,
      vetOfficeAddress,
      nodeUrl
    );
    return String(data?.value);
  } catch (err: any) {
    console.error(err.message || "An unknown error occurred");
    return "";
  }
}

export async function decodeMessage(
  encryptedMessage: string,
  senderPublicKey: string
): Promise<string> {
  try {
    return await KeeperWallet.decryptMessage(
      encryptedMessage,
      senderPublicKey,
      ""
    );
  } catch (error) {
    console.error("Error during decryption:", error);
    throw error;
  } 
}


const sharedKeyCache: { [key: string]: string } = {}; 
export function decodeMessageLocally(
  encryptedMessage: string,
  senderPublicKey: string
): string {
  try {
    if (!sharedKeyCache[senderPublicKey]) {
      sharedKeyCache[senderPublicKey] = libs.crypto.sharedKey(
        recipientPrivateKey,
        senderPublicKey,
        "waves"
      );
    }
    const sharedKey = sharedKeyCache[senderPublicKey];

    return libs.crypto.messageDecrypt(
      sharedKey,
      libs.crypto.base58Decode(encryptedMessage)
    );
  } catch (error) {
    console.error("Error during local decryption:", error);
    return "";
  }
}

export async function getMyVenearyPublicKey(aaDEntryKey: String) {
  let aaDEntryKeyAsArray = aaDEntryKey.split("_");
  const regexString = `^${aaDEntryKeyAsArray[0]}_.*_${aaDEntryKeyAsArray[1]}$`;
  //console.log(regexString);
  const fetchedData = await fetchRegexData(
    await getKeeperWalletURL(),
    vetOfficeAddress,
    regexString
  );
  let vetenaryEntryArray = fetchedData?.data[0].key.split("_");
  return vetenaryEntryArray[1];
}

export async function loadAllVetOfficeData(setProgress) {
  let fetchedData = null;
  try {
    const walletURL = await getKeeperWalletURL();
    const walletAddress = await getKeeperWalletAddress();
    //console.log("Fetching data from wallet...");
    fetchedData = await fetchRegexData(walletURL, walletAddress, `.*_verified$`);
    //console.log(`Fetched ${fetchedData.data.length} entries.`);
  } catch (error) {
    console.error("Error fetching data:", error);
    return;
  }

  const batchSize = 1000;
  const insertPromises = [];
  for (let i = 0; i < fetchedData.data.length; i += batchSize) {
    const batch = fetchedData.data.slice(i, i + batchSize);

    console.log(
      `Processing batch ${i / batchSize + 1} of ${Math.ceil(
        fetchedData.data.length / batchSize
      )}`
    );
    //console.log(`Number of messages being decoded: ${batch.length}`);

    ////console.time("Decoding Time");

    // Parallelize decoding and parsing with Promise.all
    const batchResults = await Promise.all(
      batch.map(async (entry) => {
        try {
          const decodedMessage = await decodeMessageLocally(entry.value, entry.key.split("_")[0]);
          return await parseEntryToObject(decodedMessage);
        } catch (error) {
          console.error("Error processing entry:", error);
          return null;
        }
      })
    );

    //console.timeEnd("Decoding Time");

    const validResults = batchResults.filter((result) => result !== null);

    //console.time("Insert Data Time");
    insertPromises.push(insertData(validResults))
    //console.timeEnd("Insert Data Time");
    const progressValue = Math.min(100, ((i + batchSize) / fetchedData.data.length) * 100);
    requestAnimationFrame(() => setProgress(progressValue));
    //console.log(`Batch ${i / batchSize + 1}: Decoding Time vs Insert Data Time`);
  }

  await Promise.all(insertPromises);
  setProgress(100)
}


export async function parseEntryToObject(incomingEntry: string) {
  const segments = incomingEntry.split(";");
  let signatures = [];
  let vetData = [];
  let farmerData = [];
  let aadRecords = [];
  let dateOfIssue = "";

  signatures = segments[0].split(",");
  vetData = segments[1].split(",");
  farmerData = segments[2].split(",");

  for (let i = 3; i < segments.length; i++) {
    const currentSegment = segments[i];

    if (!isNaN(Date.parse(currentSegment))) {
      dateOfIssue = currentSegment;
      break;
    } else {
      aadRecords.push(currentSegment.split(","));
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

export async function insertData(dataArray) {
  try {
    const conn = getConnection();

    let querySignature = "INSERT INTO signatures (signatureVetenary, signatureFarmer) VALUES";
    let queryDateOfIssue = "INSERT INTO dateOfIssue (dateOfIssue) VALUES";
    let queryContactVeterinary = "INSERT INTO contactDataVetenary (vetTitle, vetFirstName, vetLastName, vetStreet, vetHuseNumber, vetPostalCode, vetCity) VALUES";
    let queryContactFarmer = "INSERT INTO contactDataFarmer (farmerTitle, farmerFirstName, farmerLastName, farmerStreet, farmerHouseNumber, farmerPostalCode, farmerCity, farmerPhoneNumber) VALUES";
    let queryAadRecords =`
    INSERT INTO aadRecords (
        numberOfAnimals, 
        animalIDS, 
        species, 
        weight, 
        diagnosis, 
        diagnosisDate, 
        medicationName, 
        activeIngredient, 
        pharmaceuticalForm, 
        batchName, 
        applicationAmount, 
        dosagePerAnimalDay, 
        routeOfAdministration, 
        durationAndTiming, 
        withdrawalEdible, 
        withdrawalMilk, 
        withdrawalEggs, 
        withdrawalHoney, 
        treatmentDays, 
        effectiveDays, 
        contactDataFarmerId, 
        contactDataVetenaryId, 
        dateOfIssueId, 
        signatureId
    )VALUES`;

    let valuesSignatures = [];
    let valuesDateOfIssue = [];
    let valuesContactVeterinary = [];
    let valuesContactFarmer = [];
    let valuesAadRecords = [];

    for (let i = 0; i < dataArray.length; i++) {
      let data = dataArray[i];
      valuesSignatures.push(`('${data.Signatures[0]}', '${data.Signatures[1]}')`);
      valuesDateOfIssue.push(`('${data.DateOfIssue}')`);
      valuesContactVeterinary.push(`('${data.ContactDataVeterinary[0]}', 
                                      '${data.ContactDataVeterinary[1]}', 
                                      '${data.ContactDataVeterinary[2]}', 
                                      '${data.ContactDataVeterinary[3]}', 
                                      '${data.ContactDataVeterinary[4]}', 
                                      '${data.ContactDataVeterinary[5]}', 
                                      '${data.ContactDataVeterinary[6]}')`);
      
      valuesContactFarmer.push(`('${data.ContactDataFarmer[0]}', 
                                  '${data.ContactDataFarmer[1]}', 
                                  '${data.ContactDataFarmer[2]}', 
                                  '${data.ContactDataFarmer[3]}', 
                                  '${data.ContactDataFarmer[4]}', '
                                  ${data.ContactDataFarmer[5]}', 
                                  '${data.ContactDataFarmer[6]}', 
                                  '${data.ContactDataFarmer[7]}')`);
    }

    querySignature += valuesSignatures.join(",") + " RETURNING recordId;";
    queryDateOfIssue += valuesDateOfIssue.join(",") + " RETURNING recordId;";
    queryContactVeterinary += valuesContactVeterinary.join(",") + " RETURNING recordId;";
    queryContactFarmer += valuesContactFarmer.join(",") + " RETURNING recordId;";

    let [resSignatures, resDateOfIssue, resContactVeterinary, resContactFarmer] = await Promise.all([
      conn.query(querySignature),
      conn.query(queryDateOfIssue),
      conn.query(queryContactVeterinary),
      conn.query(queryContactFarmer)
    ]);

    const signatureIds = resSignatures.toArray().map(row => row.recordId);
    const dateOfIssueIds = resDateOfIssue.toArray().map(row => row.recordId);
    const contactVeterinaryIds = resContactVeterinary.toArray().map(row => row.recordId);
    const contactFarmerIds = resContactFarmer.toArray().map(row => row.recordId);

    for (let i = 0; i < dataArray.length; i++) {
      let data = dataArray[i];
      data.AaDRecords.forEach(aadRecord => {
        valuesAadRecords.push(`('${aadRecord[0]}', ${aadRecord[1]}, '${aadRecord[2]}', 
                                  ${aadRecord[3]}, '${aadRecord[4]}', '${aadRecord[5]}', 
                                  '${aadRecord[6]}', '${aadRecord[7]}', '${aadRecord[8]}', 
                                  '${aadRecord[9]}', ${aadRecord[10]}, ${aadRecord[11]}, 
                                  '${aadRecord[12]}', '${aadRecord[13]}', ${aadRecord[14]}, 
                                  ${aadRecord[15]}, ${aadRecord[16]}, ${aadRecord[17]}, 
                                  ${aadRecord[18]}, ${aadRecord[19]}, ${contactFarmerIds[i]}, 
                                  ${contactVeterinaryIds[i]}, ${dateOfIssueIds[i]}, ${signatureIds[i]})`);
      });
    }

    if (valuesAadRecords.length > 0) {
      queryAadRecords += valuesAadRecords.join(",") + " RETURNING recordId;";
      await conn.query(queryAadRecords);
    }

  } catch (error) {
    console.error("Error inserting data batch:", error);
  }
}
