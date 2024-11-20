import { DataSource } from "typeorm";
import { Log, Chain, User, Asset, ChainActionProposal, AssignOperator, ProcessStatus, AttackSpecies, DefendSpecies, NFTType, Info } from "./entity";
import dbConfig from "./config/DatabaseConfig"; // Import the shared singleton instance
import * as dotenv from "dotenv";
import { DbKey } from "./config/DbKey";

// Load environment variables from the .env file
dotenv.config({ path: '../docker/.env' });

const isSSLEnabled = process.env.SSL_ENABLED !== "false"; // Check if SSL is enabled, defaults to true if not set

export async function createAppDataSource(dbKey: DbKey): Promise<DataSource> {
  const dbConfigs = dbConfig.getDbConfigs();

  const dataSource = new DataSource({
    type: "postgres",
    host: dbConfigs[dbKey].host,
    port: dbConfigs[dbKey].port,
    username: dbConfigs[dbKey].user,
    password: dbConfigs[dbKey].password,
    database: dbConfigs[dbKey].dbName,
    ssl: isSSLEnabled
      ? {
          rejectUnauthorized: false,
          ca: dbConfigs[dbKey].cert || "certs/ca-certificate.crt",
        }
      : false, // Disable SSL if not enabled
    synchronize: false, // Set to true if you want to automatically sync schema changes in development
    logging: false,
    entities: [
      Log,
      Chain,
      User,
      Asset,
      ChainActionProposal,
      AssignOperator,
      ProcessStatus,
      AttackSpecies,
      DefendSpecies,
      NFTType,
      Info,
    ],
    migrations: [],
    subscribers: [],
  });

  // Initialize the data source and return the promise
  try {
    await dataSource.initialize();
    return dataSource;
  } catch (error) {
    console.error(`Error initializing DataSource for ${dbKey}:`, error);
    throw error;
  }
}
