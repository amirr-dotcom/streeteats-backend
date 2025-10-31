import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";
import { handleCORS, addCORSHeaders } from "@/lib/cors";

// Handle OPTIONS preflight request
export async function OPTIONS(request: NextRequest) {
  const corsResponse = handleCORS(request);
  return corsResponse || new NextResponse(null, { status: 204 });
}

// POST /api/auth/login - Login and get JWT token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const result = await login(validated.email, validated.password);

    const jsonResponse = Response.json(
      {
        success: true,
        data: result,
        message: "Login successful",
      },
      { status: 200 }
    );

    return addCORSHeaders(new NextResponse(jsonResponse.body, jsonResponse), request);
  } catch (error) {
    const errorResponse = handleError(error);
    return addCORSHeaders(new NextResponse(errorResponse.body, errorResponse), request);
  }
}
