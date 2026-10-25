import express from "express";
import pinoHttp from "pino-http";
import { logger } from "./utils/logger";
import { router } from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1", router);

app.use(notFoundHandler);
app.use(errorHandler);