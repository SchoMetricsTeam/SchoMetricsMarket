import prisma from "@/generated/prisma";
import { NextRequest } from "next/server";
import {
  authenticateApiRequest,
  createApiResponse,
  createApiErrorResponse,
  logApiRequest,
} from "@/lib/api-auth";

export async function OPTIONS(request: NextRequest) {
  return createApiResponse({ message: "OK" }, 200);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ purchasedMaterialId: string }> }
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
    const { purchasedMaterialId } = await params;

    if (!purchasedMaterialId || purchasedMaterialId.trim() === "") {
      return createApiErrorResponse(
        "purchasedMaterialId es requerido y debe ser válido",
        400
      );
    }

    const purchasedMaterialToDelete = await prisma.materialPurchase.findUnique({
      where: { id: purchasedMaterialId },
    });

    if (!purchasedMaterialToDelete) {
      logApiRequest(
        authResult.apiKey!,
        `/api/flutter/purchased-materials/${purchasedMaterialId}`,
        "DELETE",
        ip,
        false
      );

      return createApiErrorResponse(
        "Material Reciclable Comprado no encontrado",
        404
      );
    }

    await prisma.materialPurchase.delete({
      where: { id: purchasedMaterialId },
    });

    logApiRequest(
      authResult.apiKey!,
      `/api/flutter/purchased-materials/${purchasedMaterialId}`,
      "DELETE",
      ip,
      true
    );

    return createApiResponse({
      success: true,
      message: "Material Reciclable Comprado eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar material reciclable comprado:", error);

    logApiRequest(
      authResult.apiKey!,
      "/api/flutter/purchased-materials/[id]",
      "DELETE",
      ip,
      false
    );

    return createApiErrorResponse(
      "Error interno del servidor al eliminar material reciclable comprado",
      500
    );
  }
}
