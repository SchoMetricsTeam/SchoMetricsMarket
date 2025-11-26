// /api/buyer/purchase-material/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { MATERIAL_PRICES } from "@/lib/constants";
import { calculateFees } from "@/lib/stripe-connect";
import {
  MaterialStatus,
  PaymentStatus,
  UserType,
} from "@/generated/prisma/client";

const PurchaseSchema = z.object({
  materialId: z.string(),
  amount: z.number().positive(),
  purchaseData: z.object({
    buyerPhone: z.string(),
    transporterName: z.string(),
    transporterPhone: z.string(),
    transporterCredential: z.string(),
    collectionDate: z.string().transform((str) => new Date(str)),
    collectionTime: z.string(),
  }),
  paymentIntentId: z.string(),
});

export async function POST(request: NextRequest) {
  let paymentCaptured = false;
  let paymentIntentId: string | null = null;

  try {
    const session = await getSession();
    if (!session || session.userType !== UserType.BUYER) {
      return NextResponse.json(
        { error: "No autorizado para realizar compras" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = PurchaseSchema.safeParse(body);

    if (!validation.success) {
      console.error(
        "Errores de validación:",
        validation.error.flatten().fieldErrors
      );
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      materialId,
      amount,
      purchaseData,
      paymentIntentId: piId,
    } = validation.data;
    paymentIntentId = piId;

    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      console.log(
        `PaymentIntent recuperado: ${paymentIntentId}, status: ${paymentIntent.status}`
      );
    } catch (error) {
      console.error("Error al obtener PaymentIntent:", error);
      return NextResponse.json(
        { error: "PaymentIntent no válido" },
        { status: 400 }
      );
    }

    if (
      paymentIntent.status !== "requires_capture" &&
      paymentIntent.status !== "succeeded"
    ) {
      return NextResponse.json(
        {
          error: "El pago no está en estado válido para procesar la compra",
          paymentStatus: paymentIntent.status,
        },
        { status: 400 }
      );
    }

    if (paymentIntent.metadata.buyerId !== session.userId) {
      return NextResponse.json(
        { error: "PaymentIntent no pertenece al usuario actual" },
        { status: 403 }
      );
    }

    const material = await prisma.recyclableMaterial.findUnique({
      where: { id: materialId },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (!material) {
      if (paymentIntent.status === "requires_capture") {
        await stripe.paymentIntents.cancel(paymentIntentId);
        console.log(
          `PaymentIntent cancelado por material no encontrado: ${paymentIntentId}`
        );
      }
      return NextResponse.json(
        { error: "Material no encontrado" },
        { status: 404 }
      );
    }

    if (material.status !== MaterialStatus.AVAILABLE) {
      if (paymentIntent.status === "requires_capture") {
        await stripe.paymentIntents.cancel(paymentIntentId);
        console.log(
          `PaymentIntent cancelado por material no disponible: ${paymentIntentId}`
        );
      }
      return NextResponse.json(
        { error: "Material no disponible" },
        { status: 400 }
      );
    }

    const expectedAmount = Math.round(
      MATERIAL_PRICES[material.materialType] * material.quantity * 100
    );
    if (paymentIntent.amount !== expectedAmount) {
      if (paymentIntent.status === "requires_capture") {
        await stripe.paymentIntents.cancel(paymentIntentId);
        console.log(
          `PaymentIntent cancelado por monto incorrecto: ${paymentIntentId}`
        );
      }
      return NextResponse.json(
        {
          error: "El monto del pago no coincide con el precio del material",
          expected: expectedAmount,
          received: paymentIntent.amount,
        },
        { status: 400 }
      );
    }

    const existingPurchase = await prisma.materialPurchase.findFirst({
      where: {
        stripePaymentIntentId: paymentIntentId,
      },
    });

    if (existingPurchase) {
      console.log(`Compra ya existente para PaymentIntent: ${paymentIntentId}`);
      return NextResponse.json({
        success: true,
        purchase: existingPurchase,
        message: "Compra ya procesada anteriormente",
      });
    }

    const buyerProfile = await prisma.profile.findUnique({
      where: { userId: session.id as string },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!buyerProfile?.email) {
      if (paymentIntent.status === "requires_capture") {
        await stripe.paymentIntents.cancel(paymentIntentId);
        console.log(
          `PaymentIntent cancelado por perfil incompleto: ${paymentIntentId}`
        );
      }
      return NextResponse.json(
        { error: "Perfil de empresa incompleto" },
        { status: 400 }
      );
    }

    const { platformFeeAmount, sellerAmount } = calculateFees(expectedAmount);

    let purchase;
    try {
      purchase = await prisma.$transaction(async (tx) => {
        // Verificar de nuevo el estado del material dentro de la transacción
        const currentMaterial = await tx.recyclableMaterial.findUnique({
          where: { id: materialId },
          select: { status: true },
        });

        if (
          !currentMaterial ||
          currentMaterial.status !== MaterialStatus.AVAILABLE
        ) {
          throw new Error("Material ya no está disponible");
        }

        // Actualizar estado del material
        await tx.recyclableMaterial.update({
          where: { id: materialId },
          data: { status: MaterialStatus.PURCHASED },
        });

        // Crear registro de compra
        const newPurchase = await tx.materialPurchase.create({
          data: {
            purchaseFolio: material.folio as string,
            buyerId: session.id as string,
            buyerName: buyerProfile?.user.name as string,
            buyerRFC: buyerProfile?.rfc as string,
            buyerEmail: buyerProfile.email,
            buyerPhone: purchaseData.buyerPhone,
            buyerAddress: buyerProfile?.address as string,
            sellerId: material.userId,
            materialId,
            materialTitle: material.title,
            materialType: material.materialType,
            quantity: material.quantity,
            pricePerKg: amount / material.quantity,
            totalAmount: amount,
            platformFeeAmount: platformFeeAmount / 100,
            sellerAmount: sellerAmount / 100,
            transporterName: purchaseData.transporterName,
            transporterPhone: purchaseData.transporterPhone,
            transporterCredential: purchaseData.transporterCredential,
            collectionDate: purchaseData.collectionDate,
            collectionTime: purchaseData.collectionTime,
            collectionAddress: material.address,
            paymentStatus: PaymentStatus.PENDING,
            paymentMethod: "stripe",
            stripePaymentIntentId: paymentIntentId,
          },
          include: {
            material: {
              include: {
                user: { include: { profile: true } },
                images: true,
              },
            },
          },
        });

        console.log(
          `Registro de compra creado exitosamente: ${newPurchase.id}`
        );
        return newPurchase;
      });
    } catch (error) {
      console.error("Error en transacción de base de datos:", error);

      if (paymentIntent.status === "requires_capture") {
        try {
          await stripe.paymentIntents.cancel(paymentIntentId);
          console.log(
            `PaymentIntent cancelado por error en DB: ${paymentIntentId}`
          );
        } catch (cancelError) {
          console.error("Error al cancelar PaymentIntent:", cancelError);
        }
      }

      if (error instanceof Error) {
        if (error.message === "Material ya no está disponible") {
          return NextResponse.json(
            { error: "El material ya no está disponible" },
            { status: 409 }
          );
        }
      }

      return NextResponse.json(
        { error: "Error al registrar la compra en la base de datos" },
        { status: 500 }
      );
    }

    if (paymentIntent.status === "requires_capture") {
      try {
        const capturedPayment =
          await stripe.paymentIntents.capture(paymentIntentId);
        paymentCaptured = true;
        console.log(` ✓ Pago capturado exitosamente: ${paymentIntentId}`);

        // Actualizar el estado de la compra a COMPLETED
        await prisma.materialPurchase.update({
          where: { id: purchase.id },
          data: { paymentStatus: PaymentStatus.COMPLETED },
        });

        console.log(
          ` ✓ Estado de compra actualizado a COMPLETED: ${purchase.id}`
        );
      } catch (captureError) {
        console.error(
          " ERROR CRÍTICO: Fallo al capturar el pago:",
          captureError
        );

        try {
          await prisma.$transaction(async (tx) => {
            await tx.materialPurchase.delete({
              where: { id: purchase.id },
            });
            await tx.recyclableMaterial.update({
              where: { id: materialId },
              data: { status: MaterialStatus.AVAILABLE },
            });
          });
          console.log(
            `Rollback completado: compra eliminada y material liberado`
          );
        } catch (rollbackError) {
          console.error(" ERROR EN ROLLBACK:", rollbackError);
          // Este es un caso crítico que requiere intervención manual
        }

        return NextResponse.json(
          { error: "Error al capturar el pago. La compra ha sido cancelada." },
          { status: 500 }
        );
      }
    } else if (paymentIntent.status === "succeeded") {
      // El pago ya fue capturado antes (caso edge)
      await prisma.materialPurchase.update({
        where: { id: purchase.id },
        data: { paymentStatus: PaymentStatus.COMPLETED },
      });
      console.log(
        `Pago ya estaba capturado, estado actualizado: ${purchase.id}`
      );
    }

    return NextResponse.json({
      success: true,
      purchase,
      message: "Compra realizada y pago capturado exitosamente",
    });
  } catch (error) {
    console.error("Error crítico al procesar compra:", error);

    if (paymentCaptured && paymentIntentId) {
      try {
        console.log(
          `Intentando reembolso por error post-captura: ${paymentIntentId}`
        );
        await stripe.refunds.create({
          payment_intent: paymentIntentId,
          reason: "requested_by_customer",
        });
        console.log(`Reembolso creado exitosamente para: ${paymentIntentId}`);
      } catch (refundError) {
        console.error("ERROR AL CREAR REEMBOLSO:", refundError);
        // Requiere intervención manual
      }
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
