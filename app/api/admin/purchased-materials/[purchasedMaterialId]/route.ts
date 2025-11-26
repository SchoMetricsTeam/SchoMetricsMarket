import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UserType } from "@/generated/prisma/client";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ purchasedMaterialId: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { purchasedMaterialId } = await params;

    const purchasedMaterialToDelete = await prisma.materialPurchase.findUnique({
      where: { id: purchasedMaterialId },
    });

    if (!purchasedMaterialToDelete) {
      return NextResponse.json(
        { error: "Material Reciclable Comprado no encontrado" },
        { status: 404 }
      );
    }

    await prisma.materialPurchase.delete({
      where: { id: purchasedMaterialId },
    });

    return NextResponse.json({
      message: "Material Reciclable Comprado eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar material reciclable comprado:", error);
    return NextResponse.json(
      {
        error:
          "Error interno del servidor al eliminar material reciclable comprado",
      },
      { status: 500 }
    );
  }
}
