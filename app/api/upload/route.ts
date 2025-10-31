import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { randomUUID } from "crypto";
import { handleError } from "@/lib/errors";
import { handleCORS, addCORSHeaders } from "@/lib/cors";

// Handle OPTIONS preflight request
export async function OPTIONS(request: NextRequest) {
  const corsResponse = handleCORS(request);
  return corsResponse || new NextResponse(null, { status: 204 });
}

// POST /api/upload - Upload image file
// Alternative to base64 - stores files locally
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "No file provided",
          },
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
          },
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "File size exceeds 5MB limit",
          },
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const extension = file.name.split(".").pop() || "png";
    const filename = `${randomUUID()}.${extension}`;
    const uploadsDir = join(process.cwd(), "public", "uploads");

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filePath = join(uploadsDir, filename);

    // Write file
    await writeFile(filePath, buffer);

    // Return URL (assuming server serves /public folder)
    const url = `/uploads/${filename}`;
    const fullUrl = `${request.nextUrl.origin}${url}`;

    const response = NextResponse.json({
      success: true,
      data: { url: fullUrl, localUrl: url },
      message: "File uploaded successfully",
    });

    return addCORSHeaders(response, request);
  } catch (error) {
    const errorResponse = handleError(error);
    return addCORSHeaders(errorResponse as NextResponse, request);
  }
}
