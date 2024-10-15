import { ZodError } from "zod";

export type Result<T, E extends Error> =
	| { success: true; data: T }
	| { success: false; error: E };

export const isZodError = (x: unknown): x is ZodError => {
	return x instanceof ZodError;
};
