import { insertReciepts } from "@db/access/reciepts";
import { recieptInsertSchema } from "@db/schema/reciepts";
import { clientError } from "@src/error/httpErrors";
import {
	parseMoneyToTwoDecimals,
	removeSeparatorsNorwegianAccountNumberNoIBAN,
} from "@src/parsing/moneyParser";
import { Router, urlencoded } from "express";
import { z } from "zod";

const outlayRouter = Router();

const outlayRequestSchema = z
	.object({
		userId: z.string().transform((numString) => {
			return Number(numString);
		}),
		title: z.string().trim(),
		moneyAmount: z.string().transform((money, ctx) => {
			try {
				return parseMoneyToTwoDecimals(money);
			} catch (e) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: (e as Error).message,
				});
				return z.NEVER;
			}
		}),
		description: z.string().trim(),
		accountNumber: z
			.string()
			.trim()
			.transform((accountNumber, ctx) => {
				try {
					return removeSeparatorsNorwegianAccountNumberNoIBAN(accountNumber);
				} catch (e) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: (e as Error).message,
					});
					return z.NEVER;
				}
			}),
		purchaseDate: z
			.string()
			.date("Must be a valid ISO date format. (YYYY-MM-DD)")
			.transform((dateString) => {
				return new Date(dateString);
			}),
	})
	.pipe(recieptInsertSchema);

outlayRouter.use(urlencoded({ extended: true }));

outlayRouter.post("/new", async (req, res, next) => {
	const outlayRequest = outlayRequestSchema.safeParse(req.body);
	if (!outlayRequest.success) {
		const error = clientError(
			400,
			"Failed parsing outlayrequest.",
			outlayRequest.error,
		);
		return next(error);
	}
	const databaseResult = await insertReciepts([outlayRequest.data]);
	if (!databaseResult.success) {
		const error = clientError(400, "Database error", databaseResult.error);
		return next(error);
	}
	res.status(201).json(outlayRequest.data);
});

export default outlayRouter;
