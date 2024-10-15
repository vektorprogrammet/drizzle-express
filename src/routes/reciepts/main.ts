import { paybackReciepts, selectRecipts } from "@db/access/reciepts";
import { recieptPaybackSchema } from "@db/schema/reciepts";
import { clientError } from "@src/error/httpErrors";
import { Router, urlencoded } from "express";
import { z } from "zod";

const recieptRouter = Router();

recieptRouter.use(urlencoded({ extended: true }));

const recieptIdSchema = z
	.object({
		recieptId: z.string().transform((numString) => {
			return Number(numString);
		}),
	})
	.pipe(recieptPaybackSchema);

recieptRouter.put("/payback", async (req, res, next) => {
	const paybackRequest = recieptIdSchema.safeParse(req.body);
	if (!paybackRequest.success) {
		return next(
			clientError(400, "Failed parsing paybackrequest", paybackRequest.error),
		);
	}
	const databaseResult = await paybackReciepts([paybackRequest.data.recieptId]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(paybackRequest.data);
});

recieptRouter.get("/get", async (req, res, next) => {
	const recieptRequest = recieptIdSchema.safeParse(req.body);
	if (!recieptRequest.success) {
		return next(clientError(400, "", recieptRequest.error));
	}
	const databaseResult = await selectRecipts([recieptRequest.data.recieptId]);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});

export default recieptRouter;
