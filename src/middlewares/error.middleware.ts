import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

interface ErrorPayload {
  success: false;
  error: string;
  details?: { field: string; message: string }[];
}

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      error: "Validation failed",
      details,
    } satisfies ErrorPayload);
    return;
  }

  const statusCode = (err as NodeJS.ErrnoException & { statusCode?: number }).statusCode ?? 500;
  const message = statusCode === 500 ? "Internal server error" : err.message;

  if (statusCode === 500) {
    console.error(`[ERROR] ${new Date().toISOString()}:`, err.stack ?? err.message);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  } satisfies ErrorPayload);
}
