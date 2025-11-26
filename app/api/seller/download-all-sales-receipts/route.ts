import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { UserType } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== UserType.SELLER) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener todas las ventas del usuario
    const sales = await prisma.materialPurchase.findMany({
      where: { sellerId: session.id as string },
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

    // Retornar los datos para que el frontend genere el PDF
    return NextResponse.json({
      success: true,
      sales: sales,
    });
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al obtener ventas" },
      { status: 500 }
    );
  }
}
