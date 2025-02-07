import { address } from "@waves/ts-lib-crypto";
import { nodeInteraction } from "@waves/waves-transactions";
import { getConnection } from "./database";
import { getAllTableNamess, getAllFields } from "./sqlRequests";
import axios from "axios";
import pLimit from "p-limit";
const limit = pLimit(100);

const vetOfficeAddress = "3MsuoaqGgtSN8XzQTx3WnuMJyHv2ttGStdv"
const vetOfficepubKey = "G3mEWYSqKuwB77gUKor6D44Shif92RumcJKumDHGpqQo"

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
    console.log(err.message || "An unknown error occurred");
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
    console.log(err.message || "An unknown error occurred");
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

export async function getMyVenearyPublicKey(aaDEntryKey: String) {
  let aaDEntryKeyAsArray = aaDEntryKey.split("_");
  const regexString = `^${aaDEntryKeyAsArray[0]}_.*_${aaDEntryKeyAsArray[1]}$`;
  console.log(regexString);
  const fetchedData = await fetchRegexData(
    await getKeeperWalletURL(),
    vetOfficeAddress,
    regexString
  );
  let vetenaryEntryArray = fetchedData?.data[0].key.split("_");
  return vetenaryEntryArray[1];
}

export async function loadAllVetOfficeData() {
  let fetchedData = null;
  try {
    const walletURL = await getKeeperWalletURL();
    const walletAddress = await getKeeperWalletAddress();
    console.log("Fetching data from wallet...");
    fetchedData = await fetchRegexData(
      walletURL,
      walletAddress,
      `.*_verified$`
    );
    console.log(`Fetched ${fetchedData.data.length} entries.`);
  } catch (error) {
    console.error("Error fetching data:", error);
    return;
  }

  const batchSize = 1000;
  for (let i = 0; i < fetchedData.data.length; i += batchSize) {
    const batch = fetchedData.data.slice(i, i + batchSize);

    console.log(
      `Processing batch ${i / batchSize + 1} of ${Math.ceil(
        fetchedData.data.length / batchSize
      )}`
    );
    console.log(`Number of messages being decoded: ${batch.length}`);

    console.time("Decoding Time");
    const batchResults = await Promise.all(
      batch.map((entry) =>
        limit(async () => {
          try {
            const decodedMessage = await decodeMessage(
              entry.value,
              entry.key.split("_")[0]
            );
            return await parseEntryToObject(decodedMessage);
          } catch (error) {
            console.error("Error processing entry:", error);
            return null;
          }
        })
      )
    );
    console.timeEnd("Decoding Time");

    const validResults = batchResults.filter((result) => result !== null);

    console.time("Insert Data Time");
    await Promise.all(
      validResults.map((data) => limit(() => insertData([data])))
    );
    console.timeEnd("Insert Data Time");

    console.log(
      `Batch ${i / batchSize + 1}: Decoding Time vs Insert Data Time`
    );
  }
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

    await Promise.all(
      dataArray.map(async (data) => {
        let signatures = data.Signatures;
        let response = await conn.query(`
        INSERT INTO signatures (signatureVetenary, signatureFarmer)
        VALUES ('${signatures[0]}', '${signatures[1]}')
        RETURNING recordId;
      `);
        let signatureKey = response.batches[0].getChild("recordId").get(0);

        let dateOfIssue = data.DateOfIssue;
        response = await conn.query(`
        INSERT INTO dateOfIssue (dateOfIssue)
        VALUES ('${dateOfIssue}')
        RETURNING recordId;
      `);
        let dateOfIssueKey = response.batches[0].getChild("recordId").get(0);

        let contactDataVeterinary = data.ContactDataVeterinary;
        response = await conn.query(`
        INSERT INTO contactDataVetenary (
          vetTitle, vetFirstName, vetLastName, vetStreet,
          vetHuseNumber, vetPostalCode, vetCity
        )
        VALUES (
          '${contactDataVeterinary[0]}', '${contactDataVeterinary[1]}',
          '${contactDataVeterinary[2]}', '${contactDataVeterinary[3]}',
          '${contactDataVeterinary[4]}', '${contactDataVeterinary[5]}',
          '${contactDataVeterinary[6]}'
        )
        RETURNING recordId;
      `);
        const contactDataVeterinaryKey = response.batches[0]
          .getChild("recordId")
          .get(0);

        let contactDataFarmer = data.ContactDataFarmer;
        response = await conn.query(`
        INSERT INTO contactDataFarmer (
          farmerTitle, farmerFirstName, farmerLastName, farmerStreet,
          farmerHouseNumber, farmerPostalCode, farmerCity, farmerPhoneNumber
        )
        VALUES (
          '${contactDataFarmer[0]}', '${contactDataFarmer[1]}',
          '${contactDataFarmer[2]}', '${contactDataFarmer[3]}',
          '${contactDataFarmer[4]}', '${contactDataFarmer[5]}',
          '${contactDataFarmer[6]}', '${contactDataFarmer[7]}'
        )
        RETURNING recordId;
      `);
        const contactDataFarmerKey = response.batches[0]
          .getChild("recordId")
          .get(0);

        let aadRecords = data.AaDRecords;
        await Promise.all(
          aadRecords.map(async (aadRecord) => {
            await conn.query(`
          INSERT INTO aadRecords (
            numberOfAnimals, animalIDS, species, weight, diagnosis,
            diagnosisDate, medicationName, activeIngredient,
            pharmaceuticalForm, batchName, applicationAmount,
            dosagePerAnimalDay, routeOfAdministration, durationAndTiming,
            withdrawalEdible, withdrawalMilk, withdrawalEggs,
            withdrawalHoney, treatmentDays, effectiveDays,
            contactDataFarmerId, contactDataVetenaryId,
            dateOfIssueId, signatureId
          )
          VALUES (
            '${aadRecord[0]}', ${aadRecord[1]}, '${aadRecord[2]}',
            ${aadRecord[3]}, '${aadRecord[4]}', '${aadRecord[5]}',
            '${aadRecord[6]}', '${aadRecord[7]}', '${aadRecord[8]}',
            '${aadRecord[9]}', ${aadRecord[10]}, ${aadRecord[11]},
            '${aadRecord[12]}', '${aadRecord[13]}', ${aadRecord[14]},
            ${aadRecord[15]}, ${aadRecord[16]}, ${aadRecord[17]},
            ${aadRecord[18]}, ${aadRecord[19]}, ${contactDataFarmerKey},
            ${contactDataVeterinaryKey}, ${dateOfIssueKey}, ${signatureKey}
          )
          RETURNING recordId;
        `);
          })
        );
      })
    );
  } catch (error) {
    console.error("Error inserting data batch:", error);
  }
}