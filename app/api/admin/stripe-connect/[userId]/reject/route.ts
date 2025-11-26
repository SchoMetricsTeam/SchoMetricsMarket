import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { stripe } from "@/lib/stripe";
import { UserType } from "@/generated/prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userId } = await params;
    const body = await request.json();
    const { reason } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { stripeAccount: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (!user.stripeAccount) {
      return NextResponse.json(
        { error: "Este usuario no tiene cuenta de Stripe Connect" },
        { status: 404 }
      );
    }

    // Valid reasons: 'fraud', 'terms_of_service', or 'other'
    const rejectionReason =
      reason === "fraud" || reason === "terms_of_service" ? reason : "other";

    await stripe.accounts.reject(user.stripeAccount.stripeAccountId, {
      reason: rejectionReason,
    });

    // Update database to reflect rejection
    const updatedAccount = await prisma.stripeConnectAccount.update({
      where: { id: user.stripeAccount.id },
      data: {
        accountStatus: "REJECTED",
        chargesEnabled: false,
        payoutsEnabled: false,
      },
    });

    return NextResponse.json({
      message: "Cuenta rechazada exitosamente en Stripe y base de datos",
      account: updatedAccount,
    });
  } catch (error: any) {
    console.error("Error rejecting account:", error);

    // Handle specific Stripe errors
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: `Error de Stripe: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al rechazar la cuenta" },
      { status: 500 }
    );
  }
}
