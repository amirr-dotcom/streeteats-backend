import { NextRequest } from "next/server";
import { getShopByIdWithRelations } from "@/lib/shopFactory";
import { shopFactory } from "@/lib/shopFactory";
import { updateShopSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";
import { requireShopOwner } from "@/lib/auth";

// GET /api/shops/[id] - Get shop by ID (with owner and menu items)
// Public endpoint - anyone can view shops
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getShopByIdWithRelations(params.id);
}

// PUT /api/shops/[id] - Update shop
// Requires: Authentication + Shop ownership
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication and ownership
    const authResult = await requireShopOwner(request, params.id);
    if (authResult instanceof Response) {
      return authResult; // Error response
    }

    const body = await request.json();
    const validated = updateShopSchema.parse(body);
    return shopFactory.update(params.id, validated);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/shops/[id] - Delete shop
// Requires: Authentication + Shop ownership
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require authentication and ownership
  const authResult = await requireShopOwner(request, params.id);
  if (authResult instanceof Response) {
    return authResult; // Error response
  }

  return shopFactory.delete(params.id);
}
