import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UserType } from "@/generated/prisma/client";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ saleId: string }> }
) {
  try {
    const session = await getSession();
    const { saleId } = await params;

    const saleToDelete = await prisma.materialPurchase.findUnique({
      where: { id: saleId },
    });

    if (!saleToDelete) {
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 }
      );
    }
    if (
      !session ||
      session.id !== saleToDelete.buyerId ||
      (session.userType !== UserType.SELLER &&
        session.userType !== UserType.ADMIN)
    ) {
      return NextResponse.json(
        {
          error: "No autorizado para eliminar esta venta.",
        },
        { status: 403 }
      );
    }
    await prisma.materialPurchase.delete({
      where: { id: saleId },
    });

    return NextResponse.json({
      message: "Venta eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor al intentar eliminar la venta.",
      },
      { status: 500 }
    );
  }
}
