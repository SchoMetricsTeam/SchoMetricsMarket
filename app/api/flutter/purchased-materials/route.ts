import { type NextRequest } from "next/server";
import prisma from "@/generated/prisma";
import { getPublicSupabaseUrl } from "@/lib/supabase-service";
import {
  authenticateApiRequest,
  createApiResponse,
  createApiErrorResponse,
  logApiRequest,
} from "@/lib/api-auth";
import { MaterialType } from "@/generated/prisma/client";

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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const materialTypeFilter = searchParams.get(
      "materialType"
    ) as MaterialType | null;
    const searchTerm = searchParams.get("search") || "";

    if (page < 1 || limit < 1 || limit > 100) {
      return createApiErrorResponse(
        "Parámetros de paginación inválidos. page >= 1, limit entre 1 y 100",
        400
      );
    }

    const skip = (page - 1) * limit;

    const whereClause: any = { AND: [] };
    if (materialTypeFilter) {
      if (!Object.values(MaterialType).includes(materialTypeFilter)) {
        return createApiErrorResponse(
          `materialType inválido. Valores permitidos: ${Object.values(MaterialType).join(", ")}`,
          400
        );
      }
      whereClause.AND.push({ materialType: materialTypeFilter });
    }
    if (searchTerm) {
      whereClause.AND.push({
        OR: [{ title: { contains: searchTerm } }],
      });
    }
    if (whereClause.AND.length === 0) delete whereClause.AND;

    const purchases = await prisma.materialPurchase.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        material: {
          include: {
            user: {
              select: {
                id: true,
                identifier: true,
                name: true,
                userType: true,
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
            images: {
              orderBy: { order: "asc" },
              select: { id: true, s3Key: true, order: true },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            identifier: true,
            name: true,
            profile: {
              select: {
                address: true,
                rfc: true,
                city: true,
                state: true,
              },
            },
          },
        },
      },
    });

    const totalPurchases = await prisma.materialPurchase.count({
      where: whereClause,
    });

    const formattedPurchases = purchases.map((purchase) => ({
      ...purchase,
      material: {
        ...purchase.material,
        images: purchase.material.images.map((img) => ({
          id: img.id,
          url: getPublicSupabaseUrl(img.s3Key),
          order: img.order,
        })),
      },
    }));

    logApiRequest(
      authResult.apiKey!,
      "/api/flutter/purchased-materials",
      "GET",
      ip,
      true
    );

    return createApiResponse({
      success: true,
      purchases: formattedPurchases,
      pagination: {
        total: totalPurchases,
        page,
        limit,
        totalPages: Math.ceil(totalPurchases / limit),
        hasNextPage: page < Math.ceil(totalPurchases / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error al obtener compras:", error);

    logApiRequest(
      authResult.apiKey!,
      "/api/flutter/purchased-materials",
      "GET",
      ip,
      false
    );

    return createApiErrorResponse(
      "Error interno del servidor al obtener compras",
      500
    );
  }
}
