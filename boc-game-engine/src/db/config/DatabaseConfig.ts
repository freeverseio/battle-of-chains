import * as dotenv from "dotenv";
import IDbConfig from './IDbConfig'
import { DbKey } from "./DbKey";

dotenv.config();

class DatabaseConfig {
  static #instance: DatabaseConfig | null = null;

  private currentReadDb: IDbConfig;
  private currentWriteDb: IDbConfig;

  private dbConfigs: { [key in DbKey]: IDbConfig };

  private constructor() {
    if (DatabaseConfig.#instance) {
      throw new Error(
        "You can only create one instance of DatabaseConfig. Use DatabaseConfig.getInstance() instead."
      );
    }

    // Initialize the database configurations
    this.dbConfigs = {
      [DbKey.A]: {
        name: DbKey.A,
        host: process.env.DB_HOST_A || "localhost",
        port: parseInt(process.env.DB_PORT_A || "5432", 10),
        dbName: process.env.DB_NAME_A || "db_a",
        postgraphileUrl: process.env.POSTGRAPHILE_URL_A || "http://localhost:4001",
        user: process.env.DB_USER_A || "user_a",
        password: process.env.DB_PASSWORD_A || "password_a",
        cert: process.env.SSL_CA_CERT_A || "certs/ca-certificate.crt",
      },
      [DbKey.B]: {
        name: DbKey.B,
        host: process.env.DB_HOST_B || "localhost",
        port: parseInt(process.env.DB_PORT_B || "5432", 10),
        dbName: process.env.DB_NAME_B || "db_b",
        postgraphileUrl: process.env.POSTGRAPHILE_URL_B || "http://localhost:4002",
        user: process.env.DB_USER_B || "user_b",
        password: process.env.DB_PASSWORD_B || "password_b",
        cert: process.env.SSL_CA_CERT_B || "certs/ca-certificate.crt",
      },
    };

    // Set the default currentReadDb to dbConfigA
    this.currentReadDb = this.dbConfigs[DbKey.A];

    // Set the default currentWriteDb to dbConfigB
    this.currentWriteDb = this.dbConfigs[DbKey.B];

    // Assign the instance to the static private property
    DatabaseConfig.#instance = this;
  }

  static getInstance(): DatabaseConfig {
    if (!this.#instance) {
      this.#instance = new DatabaseConfig(); // Create instance if it doesn't exist
    }
    return this.#instance;
  }

  setCurrentReadDb(db: DbKey) {
    if (!this.dbConfigs[db]) {
      throw new Error(`Invalid database configuration name: '${db}'.`);
    }
    this.currentReadDb = this.dbConfigs[db];
  }

  getCurrentReadDb(): IDbConfig {
    return this.currentReadDb;
  }

  switchCurrentReadDB() {
    const currentDb = dbConfig.getCurrentReadDb();
    switch (currentDb.name) {
      case DbKey.A:
          console.log("Switching read from A to B")
          dbConfig.setCurrentReadDb(DbKey.B)
          break;
      case DbKey.B:
          console.log("Switching read from B to A")
          dbConfig.setCurrentReadDb(DbKey.A)
          break;
      default:
        throw new Error(`DB switch not recognized for db: ${currentDb.name}`)   
    }
  }

  setCurrentWriteDb(db: DbKey) {
    if (!this.dbConfigs[db]) {
      throw new Error(`Invalid database configuration name: '${db}'.`);
    }
    this.currentWriteDb = this.dbConfigs[db];
  }

  getCurrentWriteDb(): IDbConfig {
    return this.currentWriteDb;
  }

  switchCurrentWriteDB() {
    const currentDb = dbConfig.getCurrentWriteDb();
    switch (currentDb.name) {
      case DbKey.A:
          console.log("Switching write from A to B")
          dbConfig.setCurrentWriteDb(DbKey.B)
          break;
      case DbKey.B:
          console.log("Switching write from B to A")
          dbConfig.setCurrentWriteDb(DbKey.A)
          break;
      default:
        throw new Error(`DB switch not recognized for db: ${currentDb.name}`)   
    }
  }

  getDbConfigs() {
    return this.dbConfigs;
  }
}

// Export the singleton instance
const dbConfig = DatabaseConfig.getInstance();
export default dbConfig;
