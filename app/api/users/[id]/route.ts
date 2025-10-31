import { NextRequest } from "next/server";
import {
  userFactory,
  getUserByIdWithoutPassword,
  updateUserWithPassword,
} from "@/lib/userFactory";
import { updateUserSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getUserByIdWithoutPassword(params.id);
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateUserSchema.parse(body);
    return updateUserWithPassword(params.id, validated);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return userFactory.delete(params.id);
}
