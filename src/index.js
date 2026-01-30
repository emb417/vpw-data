import "dotenv/config";
import express from "express";
import pinoHttp from "pino-http";
import apiRouter from "./routers/api.v1.js";
import logger from "./utils/logger.js";
import { initDb, closeDb } from "./utils/mongo.js";

const PORT = process.env.PORT || 3080;

const app = express();

const httpLogger = pinoHttp({
  logger,
  customSuccessMessage: (req, res) =>
    `${res.statusCode} ${req.method} ${req.url}`,
  customErrorMessage: (req, res, err) =>
    `${res.statusCode} ${req.method} ${req.url} ${err?.message ?? ""}`,
  customAttributeKeys: {
    req: "ignore",
    res: "ignore",
    err: "ignore",
    responseTime: "ignore",
  },
  serializers: { ignore: () => undefined },
  wrapSerializers: false,
});

app.use(httpLogger);
app.use(express.json());

app.use("/api/v1", apiRouter);

const server = app.listen(PORT, async () => {
  await initDb();
  logger.info(`listening on port ${PORT}`);
});

const gracefulShutdown = async () => {
  logger.info("Shutdown signal received, closing database connection...");
  await closeDb();
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
