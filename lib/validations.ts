import { z } from "zod";

// Base64 image/QR code validation schema
// Accepts: HTTP/HTTPS URLs, base64 data URLs, or empty strings
const imageUrlSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      // Allow empty string, null, or undefined
      if (!val || val === "") return true;

      // Allow HTTP/HTTPS URLs
      if (val.startsWith("http://") || val.startsWith("https://")) {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }

      // Allow base64 data URLs (data:image/...;base64,...)
      if (val.startsWith("data:image/")) {
        const base64Regex =
          /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;
        return base64Regex.test(val);
      }

      // Allow QR code data URLs (data:image/png;base64,...)
      if (val.startsWith("data:image/png;base64,")) {
        const base64Regex = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;
        return base64Regex.test(val);
      }

      return false;
    },
    {
      message:
        "Must be a valid image URL (http/https) or base64 data URL (data:image/...;base64,...)",
    }
  );

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["vendor", "admin"]).default("vendor"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["vendor", "admin"]).optional(),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Shop validation schemas
export const createShopSchema = z.object({
  name: z.string().min(1, "Shop name is required").max(100),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  ownerId: z.string().uuid("Invalid owner ID"),
  imageUrl: imageUrlSchema,
  qrCodeUrl: imageUrlSchema,
});

export const updateShopSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  imageUrl: imageUrlSchema,
  qrCodeUrl: imageUrlSchema,
});

// Menu Item validation schemas
export const createMenuItemSchema = z.object({
  name: z.string().min(1, "Menu item name is required").max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive("Price must be positive"),
  shopId: z.string().uuid("Invalid shop ID"),
  isVeg: z.boolean().default(true),
  imageUrl: imageUrlSchema,
});

export const updateMenuItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  price: z.number().positive().optional(),
  isVeg: z.boolean().optional(),
  imageUrl: imageUrlSchema,
});

// Query parameter schemas
export const menuItemQuerySchema = z.object({
  shopId: z.string().uuid().optional(),
  isVeg: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateShopInput = z.infer<typeof createShopSchema>;
export type UpdateShopInput = z.infer<typeof updateShopSchema>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;