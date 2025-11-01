import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";

// Route segment config for Vercel compatibility
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/auth/login - Login and get JWT token
// CORS is handled globally by middleware.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const result = await login(validated.email, validated.password);

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
