import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { getPublicSupabaseUrl } from "@/lib/supabase-service";
import { UserType } from "@/generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json(
        { error: "No autorizado para ver compras" },
        { status: 401 }
      );
    }

    const { userId } = await params;

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Obtener compras del usuario actual
    const purchases = await prisma.materialPurchase.findMany({
      where: { buyerId: userId as string },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        material: {
          include: {
            user: {
              select: {
                id: true,
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
      where: { buyerId: userId as string },
    });

    // Formatear las compras con URLs públicas de imágenes
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
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
