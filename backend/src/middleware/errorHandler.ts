import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError, Errors } from "../utils/errors";
import { logger } from "../utils/logger";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(Errors.notFound(`Route ${req.method} ${req.path} not found`));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let appError: AppError | undefined;

  if (err instanceof AppError) {
    appError = err;
  } else if (err?.type === "entity.parse.failed") {
    appError = new AppError(400, "INVALID_JSON", "Request body is not valid JSON");
  }

  if (appError) {
    res.status(appError.statusCode).json({
      error: {
        code: appError.code,
        message: appError.message,
        ...(appError.details ? { details: appError.details } : {}),
      },
    });
    return;
  }

  logger.error({ err, method: req.method, path: req.path }, "Unhandled error");
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
};