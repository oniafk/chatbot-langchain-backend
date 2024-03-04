import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";

const DataBase = process.env.DATABASE_URL as string;

export const db = async () => {
  const datasource = new DataSource({
    type: "mysql",
    url: DataBase,
    host: "planetscale",
    ssl: {
      rejectUnauthorized: true,
    },
    database: "onimaedb",
  });
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });
  console.log(db.allTables.map((table) => table.tableName));
};
