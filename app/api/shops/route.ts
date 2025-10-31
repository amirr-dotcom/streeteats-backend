import { NextRequest } from "next/server";
import { getShopsWithRelations } from "@/lib/shopFactory";
import { shopFactory } from "@/lib/shopFactory";
import { createShopSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth";

// GET /api/shops - Get all shops (with owner and menu items)
// Public endpoint - anyone can view shops
export async function GET() {
  return getShopsWithRelations();
}

// POST /api/shops - Create a new shop
// Requires: Authentication + ownerId must match authenticated user
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult; // Error response
    }

    const user = authResult;
    const body = await request.json();
    const validated = createShopSchema.parse(body);

    // Ensure user can only create shops for themselves
    if (validated.ownerId !== user.userId) {
      return Response.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You can only create shops for yourself",
          },
        },
        { status: 403 }
      );
    }

    return shopFactory.create(validated);
  } catch (error) {
    return handleError(error);
  }
}
