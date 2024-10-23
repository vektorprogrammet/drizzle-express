import { env } from "node:process";
import type { ConnectionOptions } from "node:tls";
import { z } from "zod";

function getCaCert(): string | Buffer | Array<string | Buffer> | undefined {
	return env.CA_CERT;
}

export const databaseConnectionParameters = z
	.object({
		DATABASE_HOST: z.string().min(1),
		DATABASE_NAME: z.string().min(1),
		DATABASE_USER: z.string().min(1),
		DATABASE_PASSWORD: z.string().min(1),
		DATABASE_PORT: z.coerce.number().positive().finite().safe().int(),
		SSL_OPTION: z
			.union([
				z.literal("customOn").transform((_, ctx) => {
					const ca_cert = getCaCert();
					if (ca_cert === undefined) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Could not find ca certificate",
						});
						return z.NEVER;
					}
					return {
						requestCert: true,
						rejectUnauthorized: true,
						ca: ca_cert,
					} as ConnectionOptions;
				}),
				z.literal("customOff").transform(() => {
					return {
						requestCert: false,
						rejectUnauthorized: false,
					} as ConnectionOptions;
				}),
				z.literal("true").transform(() => {
					return true;
				}),
				z.literal("false").transform(() => {
					return false;
				}),
			])
			.default("false"),
	})
	.transform((schema) => {
		return {
			host: schema.DATABASE_HOST.trim(),
			database: schema.DATABASE_NAME.trim(),
			user: schema.DATABASE_USER.trim(),
			password: schema.DATABASE_PASSWORD.trim(),
			port: schema.DATABASE_PORT,
			ssl: schema.SSL_OPTION,
		};
	})
	.parse(env);

if (env.LOG_DATABASE_CREDENTIALS_ON_STARTUP === "true") {
	console.log("Database parameters:", databaseConnectionParameters);
}
