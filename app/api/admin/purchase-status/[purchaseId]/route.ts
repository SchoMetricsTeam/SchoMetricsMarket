import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import {
  MaterialStatus,
  PaymentStatus,
  UserType,
} from "@/generated/prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { purchaseId } = await params;
    const body = await request.json();
    const { materialStatus, paymentStatus } = body;

    // Validate the purchase exists
    const purchase = await prisma.materialPurchase.findUnique({
      where: { id: purchaseId },
      include: { material: true },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Compra no encontrada" },
        { status: 404 }
      );
    }

    // Update purchase and material in a transaction
    const updatedPurchase = await prisma.$transaction(async (tx) => {
      // Update material status if provided
      if (
        materialStatus &&
        Object.values(MaterialStatus).includes(materialStatus as MaterialStatus)
      ) {
        await tx.recyclableMaterial.update({
          where: { id: purchase.materialId },
          data: { status: materialStatus as MaterialStatus },
        });
      }

      // Update payment status if provided
      const updateData: any = {};
      if (
        paymentStatus &&
        Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)
      ) {
        updateData.paymentStatus = paymentStatus as PaymentStatus;
      }

      if (Object.keys(updateData).length > 0) {
        return await tx.materialPurchase.update({
          where: { id: purchaseId },
          data: updateData,
          include: {
            material: true,
          },
        });
      }

      return purchase;
    });

    return NextResponse.json({
      success: true,
      purchase: updatedPurchase,
      message: "Estados actualizados correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar estados:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
