// /api/stripe/create-payment-intent/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { MATERIAL_PRICES } from "@/lib/constants";
import prisma from "@/generated/prisma";
import { stripe } from "@/lib/stripe";
import { calculateFees } from "@/lib/stripe-connect";
import { MaterialType, UserType } from "@/generated/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== UserType.BUYER) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { materialType, quantity, materialId, purchaseData } =
      await request.json();

    if (!materialType || !quantity || !materialId) {
      return NextResponse.json(
        { error: "Tipo de material, cantidad y ID de material son requeridos" },
        { status: 400 }
      );
    }

    const idempotencyKey = `payment_${materialId}_${
      session.userId
    }_${Date.now()}`;

    const material = await prisma.recyclableMaterial.findUnique({
      where: { id: materialId },
      select: {
        id: true,
        quantity: true,
        materialType: true,
        status: true,
        userId: true,
      },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material no encontrado" },
        { status: 404 }
      );
    }

    if (material.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Material no disponible para compra" },
        { status: 400 }
      );
    }

    if (material.materialType !== materialType) {
      return NextResponse.json(
        { error: "Tipo de material no coincide con el registrado" },
        { status: 400 }
      );
    }

    if (Math.abs(material.quantity - quantity) > 0.01) {
      return NextResponse.json(
        { error: "Cantidad no coincide con la disponible" },
        { status: 400 }
      );
    }

    if (material.userId === session.userId) {
      return NextResponse.json(
        { error: "No puedes comprar tu propio material" },
        { status: 400 }
      );
    }

    const sellerConnectAccount = await prisma.stripeConnectAccount.findUnique({
      where: { userId: material.userId },
    });

    if (!sellerConnectAccount) {
      return NextResponse.json(
        {
          error:
            "El Vendedor aún no ha configurado su cuenta para recibir pagos. Por favor contacta a soporte@schometrics.com para dar seguimiento.",
        },
        { status: 400 }
      );
    }

    if (
      !sellerConnectAccount.chargesEnabled ||
      !sellerConnectAccount.payoutsEnabled
    ) {
      return NextResponse.json(
        {
          error:
            "La cuenta de pago del Vendedor aún no está completamente configurada. Por favor a soporte@schometrics.com para dar seguimiento.",
        },
        { status: 400 }
      );
    }

    const pricePerKg = MATERIAL_PRICES[materialType as MaterialType];
    if (!pricePerKg) {
      return NextResponse.json(
        { error: "Tipo de material no válido" },
        { status: 400 }
      );
    }

    const totalAmount = Math.round(pricePerKg * quantity * 100);

    if (totalAmount < 50) {
      return NextResponse.json(
        { error: "El monto mínimo de compra es $0.50 MXN" },
        { status: 400 }
      );
    }

    const { platformFeeAmount, sellerAmount } = calculateFees(totalAmount);

    const existingPurchase = await prisma.materialPurchase.findFirst({
      where: {
        materialId: materialId,
        buyerId: session.userId as string,
        paymentStatus: "PENDING",
      },
    });

    if (existingPurchase && existingPurchase.stripePaymentIntentId) {
      try {
        const existingPaymentIntent = await stripe.paymentIntents.retrieve(
          existingPurchase.stripePaymentIntentId
        );

        if (
          existingPaymentIntent.status === "requires_payment_method" ||
          existingPaymentIntent.status === "requires_confirmation" ||
          existingPaymentIntent.status === "requires_action"
        ) {
          console.log(
            `Reutilizando PaymentIntent existente: ${existingPaymentIntent.id}`
          );
          return NextResponse.json({
            clientSecret: existingPaymentIntent.client_secret,
            paymentIntentId: existingPaymentIntent.id,
            amount: totalAmount,
            platformFeeAmount: platformFeeAmount / 100,
            sellerAmount: sellerAmount / 100,
          });
        }
      } catch (error) {
        console.error("Error al recuperar PaymentIntent existente:", error);
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: totalAmount,
        currency: "mxn",
        payment_method_types: ["card"],
        capture_method: "manual", // CRÍTICO: Solo autorizar, no capturar aún
        application_fee_amount: platformFeeAmount,
        transfer_data: {
          destination: sellerConnectAccount.stripeAccountId,
        },
        metadata: {
          materialId: materialId,
          materialType: materialType,
          quantity: quantity.toString(),
          buyerId: session.userId as string,
          sellerId: material.userId,
          buyerName: purchaseData?.buyerName || "",
          buyerRFC: purchaseData?.buyerRFC || "",
          createdAt: new Date().toISOString(),
        },
      },
      {
        idempotencyKey, // Prevenir cargos duplicados
      }
    );

    console.log(`PaymentIntent creado con captura manual: ${paymentIntent.id}`);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      platformFeeAmount: platformFeeAmount / 100,
      sellerAmount: sellerAmount / 100,
      platformFeePercentage: 20,
    });
  } catch (error) {
    console.error("Error creando Payment Intent:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
