import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { getPublicSupabaseUrl } from "@/lib/supabase-service";
import { UserType } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== UserType.SELLER) {
      return NextResponse.json(
        { error: "No autorizado para ver las ventas" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Obtener ventas del usuario actual
    const sales = await prisma.materialPurchase.findMany({
      where: { sellerId: session.id as string },
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

    const totalSales = await prisma.materialPurchase.count({
      where: { sellerId: session.id as string },
    });

    // Formatear las ventas con URLs públicas de imágenes
    const formattedSales = sales.map((sales) => ({
      ...sales,
      material: {
        ...sales.material,
        images: sales.material?.images.map((img) => ({
          id: img.id,
          url: getPublicSupabaseUrl(img.s3Key),
          order: img.order,
        })),
      },
    }));

    return NextResponse.json({
      sales: formattedSales,
      pagination: {
        total: totalSales,
        page,
        limit,
        totalPages: Math.ceil(totalSales / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al obtener las ventas" },
      { status: 500 }
    );
  }
}
