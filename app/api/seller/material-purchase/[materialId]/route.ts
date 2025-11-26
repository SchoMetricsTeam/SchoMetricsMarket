import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ materialId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { materialId } = await params;

    // Buscar la compra asociada al material
    const purchase = await prisma.materialPurchase.findFirst({
      where: {
        materialId: materialId,
      },
      include: {
        material: true,
        buyer: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "No se encontró una compra para este material" },
        { status: 404 }
      );
    }

    // Verificar que el usuario sea el propietario del material
    if (session.id !== purchase.material.userId) {
      return NextResponse.json(
        { error: "No autorizado para ver esta compra" },
        { status: 403 }
      );
    }

    return NextResponse.json(purchase);
  } catch (error) {
    console.error("Error obteniendo compra del material:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
