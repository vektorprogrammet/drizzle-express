import { z } from "zod";

export function parseMoneyToTwoDecimals(money: string) {
	if (Number.isNaN(Number.parseFloat(money))) {
		throw new Error("Money is not a valid number.");
	}
	const parts = money.split(".");
	if (parts.length === 1) {
		return `${parts[0]}.00`;
	}
	if (parts.length === 2) {
		if (parts[1].length === 0) {
			return `${parts[0]}.00`;
		}
		if (parts[1].length === 1) {
			return `${parts[0]}.${parts[1]}0`;
		}
		return `${parts[0]}.${parts[1].substring(0, 2)}`;
	}
	throw new Error("Money is not a valid number.");
}

export function isScaleTwoDecimalNumber(numericString: string) {
	const parts = numericString.split(".");

	return (
		parts.length === 2 &&
		parts[1].length === 2 &&
		parts[0].length > 0 &&
		!Number.isNaN(Number.parseFloat(numericString))
	);
}
const mainSeparator = " " as const; // this must be a string
const sparatorSchema = z.union([
	z.literal(mainSeparator),
	z.literal(" "),
	z.literal("-"),
	z.literal("."),
	z.literal(":"),
	z.literal(";"),
	z.literal(","),
	z.literal("_"),
]);
export function setSeparatorsNorwegianAccountNumberNoIBAN(
	accountNumber: string,
) {
	let pureAccountNumber = accountNumber;
	if (isValidNorwegianAccountNumberNoIBANWithSeparator(accountNumber)) {
		pureAccountNumber =
			removeSeparatorsNorwegianAccountNumberNoIBAN(accountNumber);
	}
	if (isValidNorwegianAccountNumberNoIBANNoSeparator(pureAccountNumber)) {
		let separated = pureAccountNumber.substring(0, 4).concat(mainSeparator);
		separated += pureAccountNumber.substring(4, 6).concat(mainSeparator);
		separated += pureAccountNumber.substring(6);
		return separated;
	}
	throw new Error("Account number is not a valid norwegian account number.");
}
export function removeSeparatorsNorwegianAccountNumberNoIBAN(
	accountNumber: string,
) {
	if (isValidNorwegianAccountNumberNoIBANNoSeparator(accountNumber)) {
		return accountNumber;
	}
	if (isValidNorwegianAccountNumberNoIBANWithSeparator(accountNumber)) {
		const splitter = accountNumber[4];
		return accountNumber.split(splitter).join("");
	}
	throw new Error("Account number is not a valid norwegian account number.");
}

export function isValidNorwegiaAccountNumberNoIBAN(accountNumber: string) {
	return (
		isValidNorwegianAccountNumberNoIBANWithSeparator(accountNumber) ||
		isValidNorwegianAccountNumberNoIBANNoSeparator(accountNumber)
	);
}

const integerSchema = z.number().finite().nonnegative().int();

function isValidNorwegianAccountNumberNoIBANWithSeparator(
	possibleAccountNumber: string,
) {
	if (possibleAccountNumber.length !== 11 + 2) {
		return false;
	}
	const splitter = possibleAccountNumber[4];
	if (!sparatorSchema.safeParse(splitter).success) {
		return false;
	}
	const parts = possibleAccountNumber.split(splitter);
	if (
		parts.length !== 3 ||
		parts[0].length !== 4 ||
		parts[1].length !== 2 ||
		parts[2].length !== 5
	) {
		return false;
	}
	return isValidNorwegianAccountNumberNoIBANNoSeparator(parts.join(""));
}

const weightNumbers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
function isValidNorwegianAccountNumberNoIBANNoSeparator(
	possibleAccountNumber: string,
) {
	if (possibleAccountNumber.length !== 11) {
		return false;
	}

	const result = integerSchema.safeParse(
		Number.parseInt(possibleAccountNumber),
	);
	if (!result.success) {
		return false;
	}
	const controlResult = integerSchema.safeParse(
		Number.parseInt(possibleAccountNumber[10]),
	);
	const mainNumberAsString = possibleAccountNumber.substring(0, 10);
	const mainResult = integerSchema.safeParse(
		Number.parseInt(possibleAccountNumber.substring(0, 10)),
	);
	if (!controlResult.success || !mainResult.success) {
		return false;
	}
	const inputControlNumber = controlResult.data;
	const mainNumbersSum = mainNumberAsString.split("").reduce((sum, char, i) => {
		return sum + integerSchema.parse(Number.parseInt(char)) * weightNumbers[i];
	}, 0);
	const sumMod = mainNumbersSum % 11;
	const controlNumber = 11 - sumMod;
	if (controlNumber !== inputControlNumber) {
		return false;
	}
	return true;
}
