import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: mvp_worker,
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: eh_worker,
  },
};

let dbInstance: duckdb.AsyncDuckDB | null = null;

export async function initDatabase() {
  if (!dbInstance) {
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.VoidLogger();
    const db = new duckdb.AsyncDuckDB(logger, worker);

    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

    const conn = await db.connect();
    dbInstance = conn;

    await Promise.all([
      // Signatures
      await conn.send(`CREATE SEQUENCE IF NOT EXISTS signatures_seq START 1;`),
      await conn.send(`
          CREATE TABLE IF NOT EXISTS signatures (
              recordId INTEGER DEFAULT (nextval('signatures_seq')) PRIMARY KEY,
              signatureVetenary TEXT,
              signatureFarmer TEXT,
          );
      `),

      // Date of Issue
      await conn.send(`CREATE SEQUENCE IF NOT EXISTS dateOfIssue_seq START 1;`),
      await conn.send(`
  CREATE TABLE IF NOT EXISTS dateOfIssue (
      recordId INTEGER DEFAULT (nextval('dateOfIssue_seq')) PRIMARY KEY,
      dateOfIssue DATETIME NOT NULL,
  );
`),

      // Contact Data Veterinary
      await conn.send(
        `CREATE SEQUENCE IF NOT EXISTS contactDataVetenary_seq START 1;`
      ),
      await conn.send(`
  CREATE TABLE IF NOT EXISTS contactDataVetenary (
      recordId INTEGER DEFAULT (nextval('contactDataVetenary_seq')) PRIMARY KEY,
      vetTitle TEXT,
      vetFirstName TEXT,
      vetLastName TEXT,
      vetStreet TEXT,
      vetHuseNumber TEXT,
      vetPostalCode TEXT,
      vetCity TEXT,     
  );
`),

      // Contact Data Farmer
      await conn.send(
        `CREATE SEQUENCE IF NOT EXISTS contactDataFarmer_seq START 1;`
      ),
      await conn.send(`
      CREATE TABLE IF NOT EXISTS contactDataFarmer (
        recordId INTEGER DEFAULT (nextval('contactDataFarmer_seq')) PRIMARY KEY,
        farmerTitle TEXT,
        farmerFirstName TEXT,
        farmerLastName TEXT,
        farmerStreet TEXT,
        farmerHouseNumber TEXT,
        farmerPostalCode TEXT,
        farmerCity TEXT,
        farmerPhoneNumber TEXT
      );
    `),

      // aad records
      await conn.send(`CREATE SEQUENCE IF NOT EXISTS aadRecords_seq START 1;`),
      await conn.send(`
   CREATE TABLE IF NOT EXISTS aadRecords (
     recordId INTEGER DEFAULT (nextval('aadRecords_seq')) PRIMARY KEY,
     numberOfAnimals INTEGER,
     animalIDS TEXT,
     species TEXT,
     weight INTEGER,
     diagnosis TEXT,
     diagnosisDate TEXT,
     medicationName TEXT,
     activeIngredient TEXT,
     pharmaceuticalForm TEXT,
     batchName TEXT,
     applicationAmount REAL,
     dosagePerAnimalDay REAL,
     routeOfAdministration TEXT,
     durationAndTiming TEXT,
     withdrawalEdible REAL,
     withdrawalMilk REAL,
     withdrawalEggs REAL,
     withdrawalHoney REAL,
     treatmentDays INTEGER,
     effectiveDays INTEGER,
     contactDataFarmerId INTEGER REFERENCES contactDataFarmer(recordId),
     contactDataVetenaryId INTEGER REFERENCES contactDataVetenary(recordId),
     dateOfIssueId INTEGER REFERENCES dateOfIssue(recordId),
     signatureId INTEGER REFERENCES signatures(recordId)
   );
`),
    ]);
  }
}

export const getConnection = () => {
  if (!dbInstance) {
    throw new Error("Database is not initialized.");
  }
  return dbInstance;
};

export const getTables = async () => {
  const conn = getConnection();
  const query = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'main';
  `;
  try {
    const result = await conn.query(query);
    return result.map((row: { table_name: string }) => row.table_name);
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw error;
  }
};
