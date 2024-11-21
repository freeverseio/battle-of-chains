export default interface DbConfig {
    name: string;
    host: string;
    port: number;
    dbName: string;
    postgraphileUrl: string;
    user: string;
    password: string;
    cert: string;
  }