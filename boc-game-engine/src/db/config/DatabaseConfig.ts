import * as dotenv from "dotenv";
import IDbConfig from './IDbConfig'
import { DbKey } from "./DbKey";

// Load environment variables from the .env file
dotenv.config();

class DatabaseConfig {
  static #instance: DatabaseConfig | null = null;

  private currentDb: IDbConfig;

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
      },
      [DbKey.B]: {
        name: DbKey.B,
        host: process.env.DB_HOST_B || "localhost",
        port: parseInt(process.env.DB_PORT_B || "5432", 10),
        dbName: process.env.DB_NAME_B || "db_b",
        postgraphileUrl: process.env.POSTGRAPHILE_URL_B || "http://localhost:4002",
        user: process.env.DB_USER_B || "user_b",
        password: process.env.DB_PASSWORD_B || "password_b",
      },
    };

    // Set the default currentDb to dbConfigA
    this.currentDb = this.dbConfigs[DbKey.A];

    // Assign the instance to the static private property
    DatabaseConfig.#instance = this;
  }

  static getInstance(): DatabaseConfig {
    if (!this.#instance) {
      this.#instance = new DatabaseConfig(); // Create instance if it doesn't exist
    }
    return this.#instance;
  }

  setCurrentDb(db: DbKey) {
    if (!this.dbConfigs[db]) {
      throw new Error(`Invalid database configuration name: '${db}'.`);
    }
    this.currentDb = this.dbConfigs[db];
  }

  getCurrentDb(): IDbConfig {
    return this.currentDb;
  }
}

// Export the singleton instance
const dbConfig = DatabaseConfig.getInstance();
export default dbConfig;
