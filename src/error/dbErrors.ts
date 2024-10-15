import type { Result } from "@src/error/types";
import type { DatabaseError } from "pg-protocol";
import {
	getPgErrorName,
	isPgError,
	isValidPgCode,
	type pgErrorCode,
	type pgErrorName,
} from "./pgErrors";

const defaultDatabaseErrorMessage =
	"Error when trying to contact database" as const;

class ORMError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ORMError";
	}
	private hasPgErrorCause(): this is { cause: DatabaseError } {
		return isPgError(this.cause);
	}
	private hasValidPgCode(): this is {
		cause: DatabaseError & { code: pgErrorCode };
	} {
		return this.hasPgErrorCause() && isValidPgCode(this.cause.code);
	}
	private getDetail(): string | undefined {
		return this.hasPgErrorCause() ? this.cause.detail : undefined;
	}
	private getCode(): pgErrorCode | undefined {
		return this.hasValidPgCode() ? this.cause.code : undefined;
	}
	private getCodeName(): pgErrorName | undefined {
		return this.hasValidPgCode() ? getPgErrorName(this.cause.code) : undefined;
	}
	getResponse(): string {
		return this.hasValidPgCode()
			? `${this.message}: ${this.getCode()}; ${this.getCodeName()}`
			: this.message;
	}
}

export function isORMError(error: unknown): error is ORMError {
	return error instanceof ORMError;
}

export const databaseError = (message: string, cause?: Error): ORMError => {
	const error = new ORMError(message);
	if (cause !== undefined) {
		error.cause = cause;
	}
	Error.captureStackTrace(error, databaseError);
	return error;
};

export type DatabaseResult<T> = Result<T, ORMError>;

export async function catchDatabase<T>(
	func: () => Promise<T>,
	message?: string,
): Promise<DatabaseResult<T>> {
	try {
		return {
			success: true,
			data: await func(),
		};
	} catch (error) {
		const dbError =
			error instanceof ORMError
				? error
				: databaseError(
						message !== undefined ? message : defaultDatabaseErrorMessage,
						error instanceof Error ? error : undefined,
					);
		Error.captureStackTrace(dbError, catchDatabase);
		return {
			success: false,
			error: dbError,
		};
	}
}
