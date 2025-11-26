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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
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
    const { purchaseId } = await params;

    if (!purchaseId || purchaseId.trim() === "") {
      return createApiErrorResponse(
        "purchaseId es requerido y debe ser válido",
        400
      );
    }

    // Obtener la compra con todos los datos necesarios
    const purchase = await prisma.materialPurchase.findUnique({
      where: {
        id: purchaseId,
      },
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

    if (!purchase) {
      logApiRequest(
        authResult.apiKey!,
        `/api/flutter/download-receipt/${purchaseId}`,
        "GET",
        ip,
        false
      );

      return createApiErrorResponse("Compra no encontrada", 404);
    }

    logApiRequest(
      authResult.apiKey!,
      `/api/flutter/download-receipt/${purchaseId}`,
      "GET",
      ip,
      true
    );

    return createApiResponse({
      success: true,
      purchase,
    });
  } catch (error) {
    console.error("Error al obtener compra:", error);

    logApiRequest(
      authResult.apiKey!,
      "/api/flutter/download-receipt/[id]",
      "GET",
      ip,
      false
    );

    return createApiErrorResponse("Error interno del servidor", 500);
  }
}
