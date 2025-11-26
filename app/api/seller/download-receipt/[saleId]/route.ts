import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { generateSaleReceiptPDF } from "@/lib/pdf-generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ saleId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { saleId } = await params;

    // Buscar la venta con todos los datos necesarios
    const sale = await prisma.materialPurchase.findUnique({
      where: { id: saleId },
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

    if (!sale) {
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que el usuario sea el propietario del material (SELLER)
    if (session.id !== sale.material.user.id) {
      return NextResponse.json(
        { error: "No autorizado para descargar este comprobante de venta" },
        { status: 403 }
      );
    }

    // Generar el PDF
    const pdfBuffer = await generateSaleReceiptPDF(sale as any);

    // Retornar el PDF como respuesta
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="comprobante-${sale.material.user.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generando comprobante PDF:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor al generar el comprobante de venta",
      },
      { status: 500 }
    );
  }
}
