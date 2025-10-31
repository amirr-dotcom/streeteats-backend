import { NextRequest } from "next/server";
import { getMenuItemsWithFilters } from "@/lib/menuItemFactory";
import { menuItemFactory } from "@/lib/menuItemFactory";
import { createMenuItemSchema, menuItemQuerySchema } from "@/lib/validations";
import { handleError } from "@/lib/errors";
import { requireAuth, isShopOwner } from "@/lib/auth";

// GET /api/menu-items - Get all menu items (with optional filters)
// Public endpoint - anyone can view menu items
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    // Parse query parameters
    const queryParams: any = {};
    if (searchParams.get("shopId")) {
      queryParams.shopId = searchParams.get("shopId");
    }
    if (searchParams.get("isVeg")) {
      queryParams.isVeg = searchParams.get("isVeg");
    }

    // Validate query parameters if provided
    if (Object.keys(queryParams).length > 0) {
      const validated = menuItemQuerySchema.parse(queryParams);
      return getMenuItemsWithFilters(validated);
    }

    return getMenuItemsWithFilters();
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/menu-items - Create a new menu item
// Requires: Authentication + Shop ownership
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult; // Error response
    }

    const user = authResult;
    const body = await request.json();
    const validated = createMenuItemSchema.parse(body);

    // Check if user owns the shop
    const ownsShop = await isShopOwner(user.userId, validated.shopId);
    if (!ownsShop) {
      return Response.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You can only add menu items to your own shops",
          },
        },
        { status: 403 }
      );
    }

    return menuItemFactory.create(validated);
  } catch (error) {
    return handleError(error);
  }
}
