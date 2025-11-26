import { type NextRequest } from "next/server";
import prisma from "@/generated/prisma";
import {
  authenticateApiRequest,
  createApiResponse,
  createApiErrorResponse,
  logApiRequest,
} from "@/lib/api-auth";

export async function OPTIONS(request: NextRequest) {
  return createApiResponse({ message: "OK" }, 200);
}

export async function GET(request: NextRequest) {
  const authResult = authenticateApiRequest(request);

  if (!authResult.success) {
    return createApiErrorResponse(
      authResult.error || "No autorizado",
      authResult.status || 401
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  try {
    // Obtener todas las compras
    const purchases = await prisma.materialPurchase.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        material: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile: {
                  select: {
                    address: true,
                    postalCode: true,
                    cct: true,
                    rfc: true,
                    city: true,
                    state: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    logApiRequest(
      authResult.apiKey!,
      "/api/flutter/download-all-receipts",
      "GET",
      ip,
      true
    );

    return createApiResponse({
      success: true,
      purchases,
      total: purchases.length,
    });
  } catch (error) {
    console.error("Error al obtener compras:", error);

    logApiRequest(
      authResult.apiKey!,
      "/api/flutter/download-all-receipts",
      "GET",
      ip,
      false
    );

    return createApiErrorResponse("Error interno del servidor", 500);
  }
}
