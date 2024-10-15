import { drizzleDatabaseCredentials } from "@db/config/parameters";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./db/schema/*",
	out: "./db/migrations",
	dialect: "postgresql",
	dbCredentials: drizzleDatabaseCredentials,
	verbose: true,
	strict: true,
});
