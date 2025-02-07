import {getConnection} from "./database"
const tableAliases = {
  aadRecords: "aad",
  dateOfIssue: "di",
  signatures: "sig",
  contactDataVetenary: "cdv",
  contactDataFarmer: "cdf",
};


function duckDBTableDataToArray(table: { schema: { fields: any[]; }; batches: any; })  {
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
        PRAGMA show_tables;
      `;
      let data = await conn.query(query);
      return duckDBTableDataToArray(data);
  }


  export async function getAllFields(tablename: string) {
    let conn = getConnection();
    let query = `
        PRAGMA table_info('${tablename}');
    `;
    let data = await conn.query(query);
    return duckDBTableDataToArray(data);
 
}


type RequestFilter = [tableName: string, key: string,  value: any, operator?: string];
type RequestFilters = RequestFilter[];

export async function filterDatabase(requestedTable: string, requestFilters: RequestFilters) {
  const tableAliases = {
    aadRecords: "aad",
    dateOfIssue: "di",
    signatures: "sig",
    contactDataVetenary: "cdv",
    contactDataFarmer: "cdf",
  };

  let conn = getConnection();
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
  `;

  requestFilters.forEach((filter, index) => {
    let [tableName, key, value, operator = "="] = filter;
    const alias = tableAliases[tableName];
    let condition = `${alias}.${key} ${operator} '${value}'`;

    if (key === "dateOfIssue") {
      // Convert DD.MM.YYYY to YYYY-MM-DD HH:MM:SS
      let [day, month, year] = value.split(".");
      let startOfDay = `${year}-${month}-${day} 00:00:00`;
      let endOfDay = `${year}-${month}-${day} 23:59:59`;

      if (operator === "=") {
          condition = `${alias}.${key} BETWEEN CAST('${startOfDay}' AS TIMESTAMP) AND CAST('${endOfDay}' AS TIMESTAMP)`;
      } else if (operator === ">") {
          condition = `${alias}.${key} > CAST('${endOfDay}' AS TIMESTAMP)`;
      } else if (operator === ">=") {
          condition = `${alias}.${key} >= CAST('${startOfDay}' AS TIMESTAMP)`;
      } else if (operator === "<") {
          condition = `${alias}.${key} < CAST('${startOfDay}' AS TIMESTAMP)`;
      } else if (operator === "<=") {
          condition = `${alias}.${key} <= CAST('${endOfDay}' AS TIMESTAMP)`;
      } else if (operator === "!=") {
        condition = `${alias}.${key} != CAST('${endOfDay}' AS TIMESTAMP)`;
    }
  }
  

    
    query += index === 0 ? ` WHERE ${condition}` : ` AND ${condition}`;
  });

  let response = await conn.query(query);
  return duckDBTableDataToArray(response);
}
  

  export async function getAntibioticSummary(requestFilters) {
    let conn = getConnection();
    let query = `
    SELECT 
        ${tableAliases.aadRecords}.species,
        SUM(${tableAliases.aadRecords}.applicationAmount * ${tableAliases.aadRecords}.numberOfAnimals) AS totalAntibiotics,
        AVG(${tableAliases.aadRecords}.applicationAmount) AS avgAntibioticsPerAnimalPerSpecies
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
    `;

    requestFilters.forEach((filter, index) => {
        let [tableName, key, value , operator = "="] = filter;
        const alias = tableAliases[tableName];
        let condition = `${alias}.${key} = '${value}'`;
        if (key === "dateOfIssue") {
          let [day, month, year] = value.split(".");
          let startOfDay = `${year}-${month}-${day} 00:00:00`;
          let endOfDay = `${year}-${month}-${day} 23:59:59`;
          if (operator === "=") {
              condition = `${alias}.${key} BETWEEN CAST('${startOfDay}' AS TIMESTAMP) AND CAST('${endOfDay}' AS TIMESTAMP)`;
          } else if (operator === ">") {
              condition = `${alias}.${key} > CAST('${endOfDay}' AS TIMESTAMP)`;
          } else if (operator === ">=") {
              condition = `${alias}.${key} >= CAST('${startOfDay}' AS TIMESTAMP)`;
          } else if (operator === "<") {
              condition = `${alias}.${key} < CAST('${startOfDay}' AS TIMESTAMP)`;
          } else if (operator === "<=") {
              condition = `${alias}.${key} <= CAST('${endOfDay}' AS TIMESTAMP)`;
          }else if (operator === "!=") {
            condition = `${alias}.${key} != CAST('${endOfDay}' AS TIMESTAMP)`;
        }
      }
      
        query += index === 0 ? ` WHERE ${condition}` : ` AND ${condition}`;
    });

    query += ` AND ${tableAliases.aadRecords}.DiagnosisDate != ''
               GROUP BY ${tableAliases.aadRecords}.species`;

    let response = await conn.query(query);
    const outcome = duckDBTableDataToArray(response);
    let total = { "species": "All Animals", "totalAntibiotics": 0, "avgAntibioticsPerAnimalPerSpecies": undefined}
    outcome.forEach(finding =>{
      total.totalAntibiotics += finding.totalAntibiotics
    })
    outcome.push(total)

    return outcome;
}
