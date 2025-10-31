import { NextRequest } from "next/server";
import { createUserWithPassword, getAllUsersWithoutPassword } from "@/lib/userFactory";
import { createUserSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";

// GET /api/users - Get all users
export async function GET() {
  return getAllUsersWithoutPassword();
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);
    return createUserWithPassword(validated);
  } catch (error) {
    return handleError(error);
  }
}
