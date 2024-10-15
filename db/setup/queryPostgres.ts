import "dotenv/config";
import { databaseConnectionParameters } from "@db/config/parameters";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg"; // It does not work to import { Client } from "pg"

console.log("Database parameters:", databaseConnectionParameters);
export const postgresClient = new pg.Client(databaseConnectionParameters);
await postgresClient.connect();
export const database = drizzle(postgresClient);

console.log("Successfully connected to database.");
