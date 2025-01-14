import {getConnection} from "./database"

function duckDBTableDataToArray(table)  {
    const columnNames = table.schema.fields.map((field) => field.name);
  
    const result = [];
    for (const batch of table.batches) {
      for (let i = 0; i < batch.numRows; i++) {
        const row = {};
        columnNames.forEach((columnName, colIndex) => {
          row[columnName] = batch.getChildAt(colIndex).get(i);
        });
        result.push(row);
      }
    }
    return result;
  };

  export async function getAllTableNamess() {
      let conn = getConnection();
      let query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'main'
          AND table_type = 'BASE TABLE';
      `;
      let data = await conn.query(query);
      return duckDBTableDataToArray(data);
  }





type RequestFilter = [tableName: string, key: string, value: any];
type RequestFilters = RequestFilter[];
  export async function filterDatabase(requestedTable:string, requestFilters: RequestFilters ){
    const tableAliases = {
      aadRecords: "aad",
      dateOfIssue: "di",
      signatures: "sig",
      contactDataVetenary: "cdv",
      contactDataFarmer: "cdf",
    };

    let conn = getConnection()
    let query = `
    SELECT ${tableAliases[requestedTable]}.*
    FROM 
        aadRecords AS ${tableAliases.aadRecords}
    JOIN dateOfIssue AS ${tableAliases.dateOfIssue}
        ON ${tableAliases.aadRecords}.dateOfIssueId = ${tableAliases.dateOfIssue}.recordId
    JOIN signatures AS ${tableAliases.signatures}
        ON ${tableAliases.aadRecords}.signatureId = ${tableAliases.signatures}.recordId
    JOIN contactDataVetenary AS ${tableAliases.contactDataVetenary}
        ON ${tableAliases.aadRecords}.contactDataVetenaryId = ${tableAliases.contactDataVetenary}.recordId
    JOIN contactDataFarmer AS ${tableAliases.contactDataFarmer}
        ON ${tableAliases.aadRecords}.contactDataFarmerId = ${tableAliases.contactDataFarmer}.recordId
  `

  requestFilters.forEach((filter, index) => {
    const [tableName, key, value] = filter;
    const alias = tableAliases[tableName];
    const condition = `${alias}.${key} = '${value}'`;
    query += index === 0 ? ` WHERE ${condition}` : ` AND ${condition}`;
  });

  let response = await conn.query(query)
  return(duckDBTableDataToArray(response))
  }
