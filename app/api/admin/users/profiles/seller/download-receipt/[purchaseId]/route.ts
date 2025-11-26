import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { generateSaleReceiptPDF } from "@/lib/pdf-generator";
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

    // Buscar la compra con todos los datos necesarios
    const purchase = await prisma.materialPurchase.findUnique({
      where: { id: purchaseId },
      include: {
        material: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        buyer: {
          include: {
            profile: true,
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

    // // Verificar que el usuario sea el propietario del material (escuela)
    // if (userId !== purchase.material.userId) {
    //   return NextResponse.json(
    //     { error: "No autorizado para descargar este comprobante" },
    //     { status: 403 }
    //   );
    // }

    // Generar el PDF
    const pdfBuffer = await generateSaleReceiptPDF(purchase as any);

    // Retornar el PDF como respuesta
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="comprobante-${purchase.sellerId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generando comprobante PDF:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
