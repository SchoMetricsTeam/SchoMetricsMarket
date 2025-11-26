import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { getPublicSupabaseUrl } from "@/lib/supabase-service";
import { MaterialType, UserType } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json(
        { error: "No autorizado para ver compras" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const materialTypeFilter = searchParams.get(
      "materialType"
    ) as MaterialType | null;
    const searchTerm = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const whereClause: any = { AND: [] };
    if (materialTypeFilter) {
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
        // Mapear las imágenes del material (esto ya estaba correcto)
        images: purchase.material.images.map((img) => ({
          id: img.id,
          url: getPublicSupabaseUrl(img.s3Key),
          order: img.order,
        })),
      },
    }));

    return NextResponse.json({
      purchases: formattedPurchases,
      pagination: {
        total: totalPurchases,
        page,
        limit,
        totalPages: Math.ceil(totalPurchases / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener compras:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al obtener compras" },
      { status: 500 }
    );
  }
}
