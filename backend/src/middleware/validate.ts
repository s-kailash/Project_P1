import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { Errors, type ErrorDetail } from "../utils/errors";

type Schemas = { body?: ZodType; query?: ZodType; params?: ZodType };

export function validate(schemas: Schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    const details: ErrorDetail[] = [];
    const validated: Record<string, unknown> = {};

    for (const key of ["body", "query", "params"] as const) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (result.success) {
        validated[key] = result.data;
      } else {
        for (const issue of result.error.issues) {
          const path = issue.path.map(String);
          const field = (key === "body" ? path : [key, ...path]).join(".");
          details.push({ field, message: issue.message });
        }
      }
    }

    if (details.length > 0) return next(Errors.validation(details));

    res.locals.validated = validated;
    next();
  };
}
