export type ErrorDetail = { field: string; message: string };

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: ErrorDetail[],
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const Errors = {
  validation: (details: ErrorDetail[]) =>
    new AppError(400, "VALIDATION_ERROR", "Invalid request data", details),
  unauthorized: (message = "Authentication required") =>
    new AppError(401, "UNAUTHORIZED", message),
  forbidden: (message = "You do not have permission to do this") =>
    new AppError(403, "FORBIDDEN", message),
  notFound: (message = "Resource not found") =>
    new AppError(404, "NOT_FOUND", message),
  conflict: (message: string) => new AppError(409, "CONFLICT", message),
};