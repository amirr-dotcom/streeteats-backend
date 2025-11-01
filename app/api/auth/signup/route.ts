import { NextRequest, NextResponse } from "next/server";
import { createUserWithPassword } from "@/lib/userFactory";
import { createUserSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";

// Route segment config for Vercel compatibility
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Handle OPTIONS preflight request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204 });
}

// POST /api/auth/signup - Register a new user (Signup)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);

    const response = await createUserWithPassword(validated);
    
    // Extract data from the response
    const responseData = await response.json();
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: responseData.data,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
