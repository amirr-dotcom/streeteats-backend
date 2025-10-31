import { NextRequest, NextResponse } from "next/server";
import { createUserWithPassword } from "@/lib/userFactory";
import { createUserSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";
import { handleCORS, addCORSHeaders } from "@/lib/cors";

// Route segment config for Vercel compatibility
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Handle OPTIONS preflight request
export async function OPTIONS(request: NextRequest) {
  const corsResponse = handleCORS(request);
  return corsResponse || new NextResponse(null, { status: 204 });
}

// POST /api/auth/signup - Register a new user (Signup)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);

    const response = await createUserWithPassword(validated);
    
    // Extract data from the response
    const responseData = await response.json();
    
    // Create response with custom message - matching login route pattern
    const jsonResponse = Response.json(
      {
        success: true,
        data: responseData.data,
        message: "User registered successfully",
      },
      { status: 201 }
    );

    return addCORSHeaders(
      new NextResponse(jsonResponse.body, jsonResponse),
      request
    );
  } catch (error) {
    const errorResponse = handleError(error);
    return addCORSHeaders(
      new NextResponse(errorResponse.body, errorResponse),
      request
    );
  }
}
