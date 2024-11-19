import { DataSource } from "typeorm";
import { Log, Chain, User, Asset, ChainActionProposal, AssignOperator, ProcessStatus, AttackSpecies, DefendSpecies, NFTType, Info } from "./entity";
import dbConfig from "./config/DatabaseConfig"; // Import the shared singleton instance
import * as dotenv from "dotenv";
import { DbKey } from "./config/DbKey";

// Load environment variables from the .env file
dotenv.config({ path: '../docker/.env' });

const isSSLEnabled = process.env.SSL_ENABLED !== "false"; // Check if SSL is enabled, defaults to true if not set

function createAppDataSource(): DataSource {
  // Get the current DB configuration from the singleton instance
  const currentDbConfig = dbConfig.getCurrentDb();

  return new DataSource({
    type: "postgres",
    host: currentDbConfig.host,
    port: currentDbConfig.port,
    username: currentDbConfig.user,
    password: currentDbConfig.password,
    database: currentDbConfig.dbName,
    ssl: isSSLEnabled
      ? {
          rejectUnauthorized: false,
          ca: process.env.SSL_CA_CERT || "certs/ca-certificate.crt",
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
}

// Initialize the AppDataSource dynamically
export let AppDataSource = createAppDataSource();

export function switchDB() {
  const currentDb = dbConfig.getCurrentDb();
  console.log("currentDB: ", currentDb)
  switch (currentDb.name) {
    case DbKey.A:
        console.log("Switching from A to B")
        dbConfig.setCurrentDb(DbKey.B)
        break;
    case DbKey.B:
        console.log("Switching from B to A")
        dbConfig.setCurrentDb(DbKey.A)
        break;
    default:
      throw new Error(`DB switch not recognized for db: ${currentDb.name}`)   
  }
  // Reinitialize AppDataSource whenever the current database changes
  if (AppDataSource.isInitialized) {
    AppDataSource.destroy().then(() => {
      AppDataSource = createAppDataSource();
    });
  } else {
    AppDataSource = createAppDataSource();
  }
}
