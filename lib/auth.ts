import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { handleError, AppError, ErrorCode } from "./errors";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

// Verify JWT token
export function verifyToken(token: string): AuthTokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch (error) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid or expired token", 401);
  }
}

// Extract token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

// Authenticate request and return user
export async function authenticateRequest(
  request: NextRequest
): Promise<AuthTokenPayload> {
  const token = getTokenFromRequest(request);

  if (!token) {
    throw new AppError(
      ErrorCode.UNAUTHORIZED,
      "Authentication required. Please provide a valid token.",
      401
    );
  }

  return verifyToken(token);
}

// Authentication middleware
export async function requireAuth(
  request: NextRequest
): Promise<NextResponse | AuthTokenPayload> {
  try {
    return await authenticateRequest(request);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }
    return handleError(error);
  }
}

// Login function
export async function login(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(
      ErrorCode.UNAUTHORIZED,
      "Invalid email or password",
      401
    );
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new AppError(
      ErrorCode.UNAUTHORIZED,
      "Invalid email or password",
      401
    );
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Return user (without password) and token
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
}

// Check if user owns a shop
export async function isShopOwner(
  userId: string,
  shopId: string
): Promise<boolean> {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: { ownerId: true },
  });

  if (!shop) {
    return false;
  }

  return shop.ownerId === userId;
}

// Check if user owns a menu item (via shop ownership)
export async function isMenuItemOwner(
  userId: string,
  menuItemId: string
): Promise<boolean> {
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
    select: { shop: { select: { ownerId: true } } },
  });

  if (!menuItem) {
    return false;
  }

  return menuItem.shop.ownerId === userId;
}

// Authorization middleware - requires user to own the shop
export async function requireShopOwner(
  request: NextRequest,
  shopId: string
): Promise<NextResponse | AuthTokenPayload> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // Error response
  }

  const user = authResult;
  const isOwner = await isShopOwner(user.userId, shopId);

  if (!isOwner) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.FORBIDDEN,
          message: "You can only manage your own shops",
        },
      },
      { status: 403 }
    );
  }

  return user;
}

// Authorization middleware - requires user to own the menu item's shop
export async function requireMenuItemOwner(
  request: NextRequest,
  menuItemId: string
): Promise<NextResponse | AuthTokenPayload> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // Error response
  }

  const user = authResult;
  const isOwner = await isMenuItemOwner(user.userId, menuItemId);

  if (!isOwner) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.FORBIDDEN,
          message: "You can only manage menu items from your own shops",
        },
      },
      { status: 403 }
    );
  }

  return user;
}
