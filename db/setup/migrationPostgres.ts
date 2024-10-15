import { database, postgresClient } from "@db/setup/queryPostgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

await migrate(database, { migrationsFolder: "@db/migrations" });

await postgresClient.end();
