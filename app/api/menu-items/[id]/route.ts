import { NextRequest } from "next/server";
import { getMenuItemByIdWithShop } from "@/lib/menuItemFactory";
import { menuItemFactory } from "@/lib/menuItemFactory";
import { updateMenuItemSchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";
import { requireMenuItemOwner } from "@/lib/auth";

// GET /api/menu-items/[id] - Get menu item by ID (with shop relation)
// Public endpoint - anyone can view menu items
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getMenuItemByIdWithShop(params.id);
}

// PUT /api/menu-items/[id] - Update menu item
// Requires: Authentication + Shop ownership
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication and ownership
    const authResult = await requireMenuItemOwner(request, params.id);
    if (authResult instanceof Response) {
      return authResult; // Error response
    }

    const body = await request.json();
    const validated = updateMenuItemSchema.parse(body);
    return menuItemFactory.update(params.id, validated);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/menu-items/[id] - Delete menu item
// Requires: Authentication + Shop ownership
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require authentication and ownership
  const authResult = await requireMenuItemOwner(request, params.id);
  if (authResult instanceof Response) {
    return authResult; // Error response
  }

  return menuItemFactory.delete(params.id);
}
