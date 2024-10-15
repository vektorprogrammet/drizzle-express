import { STATUS_CODES } from "node:http";
import { type Result, isZodError } from "@src/error/types";
import { fromZodError } from "zod-validation-error";
import { isORMError } from "./dbErrors";

class HTTPError extends Error {
	private errorCode: number;
	private displayCause: boolean;
	constructor(message: string, httpErrorCode: number, displayCause: boolean) {
		super(message);
		if (!Object.keys(STATUS_CODES).includes(httpErrorCode.toString())) {
			throw new Error(`${httpErrorCode} is not a http statuscode.`);
		}
		if (
			Math.floor(httpErrorCode / 100) !== 4 &&
			Math.floor(httpErrorCode / 100) !== 5
		) {
			throw new Error(`${httpErrorCode} is not a http errorcode.`);
		}
		this.name = "HTTPError";
		this.errorCode = httpErrorCode;
		this.displayCause = displayCause;
	}
	private getHTTPErrorLabel(): string {
		return STATUS_CODES[this.errorCode.toString()] as string;
	}
	private getCauseString() {
		let causeString = "";
		if (this.displayCause && this.cause instanceof Error) {
			if (isHTTPError(this.cause)) {
				causeString += this.cause.getResponseBodyText();
			} else if (isORMError(this.cause)) {
				causeString += this.cause.getResponse();
			} else if (isZodError(this.cause)) {
				causeString += fromZodError(this.cause);
			} else if (this.cause instanceof Error) {
				causeString += this.cause.message;
			}
		}
		return causeString;
	}
	getResponseBodyText() {
		return `${this.errorCode.toString()} ${this.getHTTPErrorLabel()}: ${this.message}\n\t${this.getCauseString()}`;
	}
	getResponseBodyJSON() {
		return {
			error: true,
			message: this.message,
			cause: this.getCauseString(),
		};
	}
	getErrorCode(): number {
		return this.errorCode;
	}
}

class ServerError extends HTTPError {
	constructor(message: string, httpErrorCode = 500, displayCause = false) {
		super(message, httpErrorCode, displayCause);
		if (Math.floor(httpErrorCode / 100) !== 5) {
			throw new Error(
				`${httpErrorCode} is not a valid servererrorcode. Must start with 5.`,
			);
		}
		this.name = "ServerError";
	}
}

class ClientError extends HTTPError {
	constructor(message: string, httpErrorCode = 400, displayCause = true) {
		super(message, httpErrorCode, displayCause);
		if (Math.floor(httpErrorCode / 100) !== 4) {
			throw new Error(
				`${httpErrorCode}is not a valid clienterrorcode. Must start with 4.`,
			);
		}
		this.name = "ClientError";
	}
}

export const clientError = (
	// biome-ignore lint/style/useDefaultParameterLast: To have code as first parameter
	httpStatusCode = 400,
	message: string,
	cause?: Error,
	displayCause = true,
): ClientError => {
	const error = new ClientError(message, httpStatusCode, displayCause);
	if (cause !== undefined) {
		error.cause = cause;
	}
	Error.captureStackTrace(error, clientError);
	return error;
};

export const serverError = (
	// biome-ignore lint/style/useDefaultParameterLast: To have code as first parameter
	httpStatusCode = 500,
	message: string,
	cause?: Error,
	displayCause = false,
): ServerError => {
	const error = new ServerError(message, httpStatusCode, displayCause);
	if (cause !== undefined) {
		error.cause = cause;
	}
	Error.captureStackTrace(error, serverError);
	return error;
};

export function isHTTPError(
	x: unknown,
): x is ServerError | ClientError | HTTPError {
	return (
		x instanceof ServerError ||
		x instanceof ClientError ||
		x instanceof HTTPError
	);
}

export type HTTPResult<T> = Result<T, HTTPError>;
