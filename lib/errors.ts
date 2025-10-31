import { NextResponse } from "next/server";
import { ZodError } from "zod";

export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  CONFLICT = "CONFLICT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // Prisma errors
    if (error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.CONFLICT,
            message: "Resource already exists",
          },
        },
        { status: 409 }
      );
    }

    if (error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: "Resource not found",
          },
        },
        { status: 404 }
      );
    }

    // Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Validation failed",
            details: error.errors.map((err) => ({
              path: err.path.join("."),
              message: err.message,
            })),
          },
        },
        { status: 400 }
      );
    }
  }

  // Unknown errors
  console.error("Unexpected error:", error);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "An unexpected error occurred",
      },
    },
    { status: 500 }
  );
}

export function notFound(message: string = "Resource not found"): AppError {
  return new AppError(ErrorCode.NOT_FOUND, message, 404);
}

export function validationError(
  message: string = "Validation failed"
): AppError {
  return new AppError(ErrorCode.VALIDATION_ERROR, message, 400);
}

export function conflictError(
  message: string = "Resource already exists"
): AppError {
  return new AppError(ErrorCode.CONFLICT, message, 409);
}
