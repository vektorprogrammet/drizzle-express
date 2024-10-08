import express from "express";

import {logger} from "@src/logging/loggingMiddleware"
import { errorHandler, /*defaultErrorHandler*/ } from "@src/error/errorMiddleware";

import outlayRouter from "@routes/outlays/main"

import { customCors, customHelmetSecurity } from "@src/security";

const app = express();
const port = 3000;

// Security
app.use(customHelmetSecurity);
app.disable('x-powered-by');
app.use(customCors());

app.use("/", logger);

app.use("/outlays", outlayRouter);

app.use("/", errorHandler);
//app.use("/", defaultErrorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});