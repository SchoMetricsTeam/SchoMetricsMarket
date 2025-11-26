// /api/stripe/confirm-payment/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import prisma from "@/generated/prisma";
import { UserType } from "@/generated/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== UserType.BUYER) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID es requerido" },
        { status: 400 }
      );
    }

    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error("Error al obtener PaymentIntent:", error);
      return NextResponse.json(
        { error: "PaymentIntent no válido o no encontrado" },
        { status: 400 }
      );
    }

    if (paymentIntent.metadata.buyerId !== session.userId) {
      return NextResponse.json(
        { error: "PaymentIntent no pertenece al usuario actual" },
        { status: 403 }
      );
    }

    const purchase = await prisma.materialPurchase.findFirst({
      where: {
        stripePaymentIntentId: paymentIntentId,
        buyerId: session.userId as string,
      },
      include: {
        material: true,
      },
    });

    if (paymentIntent.status === "requires_capture") {
      console.log(
        `PaymentIntent ${paymentIntentId} autorizado y listo para capturar`
      );

      return NextResponse.json({
        status: "requires_capture",
        paymentIntentId,
        message: "Pago autorizado. Proceder con registro de compra.",
        amount: paymentIntent.amount,
        metadata: paymentIntent.metadata,
        readyForPurchase: true,
      });
    } else if (paymentIntent.status === "succeeded") {
      if (!purchase) {
        console.error(
          `ALERTA: Pago exitoso sin registro de compra para PaymentIntent ${paymentIntentId}`
        );
        return NextResponse.json(
          {
            status: "succeeded",
            paymentIntentId,
            message:
              "Pago procesado pero falta registro de compra. Contacta soporte.",
            amount: paymentIntent.amount,
            metadata: paymentIntent.metadata,
            requiresManualReview: true,
          },
          { status: 200 }
        );
      }

      if (purchase.paymentStatus === "PENDING") {
        await prisma.materialPurchase.update({
          where: { id: purchase.id },
          data: { paymentStatus: "COMPLETED" },
        });
      }

      return NextResponse.json({
        status: "succeeded",
        paymentIntentId,
        message: "Pago completado exitosamente",
        amount: paymentIntent.amount,
        metadata: paymentIntent.metadata,
        purchase: {
          id: purchase.id,
          folio: purchase.purchaseFolio,
          materialTitle: purchase.materialTitle,
          quantity: purchase.quantity,
          totalAmount: purchase.totalAmount,
        },
      });
    } else if (paymentIntent.status === "canceled") {
      if (purchase) {
        await prisma.$transaction(async (tx) => {
          await tx.materialPurchase.delete({
            where: { id: purchase.id },
          });
          await tx.recyclableMaterial.update({
            where: { id: purchase.materialId },
            data: { status: "AVAILABLE" },
          });
        });
        console.log(
          `Compra cancelada y material liberado para PaymentIntent ${paymentIntentId}`
        );
      }

      return NextResponse.json(
        {
          status: "canceled",
          paymentIntentId,
          message: "El pago fue cancelado.",
        },
        { status: 400 }
      );
    } else if (paymentIntent.status === "requires_payment_method") {
      if (purchase) {
        await prisma.$transaction(async (tx) => {
          await tx.materialPurchase.update({
            where: { id: purchase.id },
            data: { paymentStatus: "FAILED" },
          });
          await tx.recyclableMaterial.update({
            where: { id: purchase.materialId },
            data: { status: "AVAILABLE" },
          });
        });
        console.log(
          `Pago fallido, material liberado para PaymentIntent ${paymentIntentId}`
        );
      }

      return NextResponse.json(
        {
          status: "requires_payment_method",
          paymentIntentId,
          message: "El pago falló. Por favor, intenta con otro método de pago.",
          lastPaymentError: paymentIntent.last_payment_error?.message || null,
        },
        { status: 400 }
      );
    } else {
      console.log(
        `PaymentIntent ${paymentIntentId} en estado: ${paymentIntent.status}`
      );
      return NextResponse.json(
        {
          status: paymentIntent.status,
          paymentIntentId,
          message: `El pago se encuentra en estado: ${paymentIntent.status}.`,
        },
        { status: 202 }
      );
    }
  } catch (error) {
    console.error("Error confirmando pago:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
