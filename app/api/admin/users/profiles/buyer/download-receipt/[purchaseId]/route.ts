import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { UserType } from "@/generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseId: string; userId: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { purchaseId, userId } = await params;

    // Obtener la compra con todos los datos necesarios
    const purchase = await prisma.materialPurchase.findUnique({
      where: {
        id: purchaseId,
        buyerId: userId as string, // Asegurar que solo puede descargar sus propias compras
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
      return NextResponse.json(
        { error: "Compra no encontrada" },
        { status: 404 }
      );
    }

    // Retornar los datos para que el frontend genere el PDF
    return NextResponse.json({
      success: true,
      purchase,
    });
  } catch (error) {
    console.error("Error al obtener compra:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
