import { NextRequest, NextResponse } from "next/server";
import { createUserWithPassword } from "@/lib/userFactory";
import { createUserSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";

// Route segment config for Vercel compatibility
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/auth/signup - Register a new user (Signup)
// CORS is handled globally by middleware.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);

    const userResponse = await createUserWithPassword(validated);

    // Extract data from the response
    const responseData = await userResponse.json();

    // Return success response (CORS handled by middleware)
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
