import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { getAccountStatus } from "@/lib/stripe-connect";
import { UserType } from "@/generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== UserType.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userId } = await params;

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
        {
          hasAccount: false,
          message: "Este usuario no tiene cuenta de Stripe Connect",
        },
        { status: 200 }
      );
    }

    // Get fresh status from Stripe
    const stripeStatus = await getAccountStatus(
      user.stripeAccount.stripeAccountId
    );

    // Update local database
    const updatedAccount = await prisma.stripeConnectAccount.update({
      where: { id: user.stripeAccount.id },
      data: {
        chargesEnabled: stripeStatus.chargesEnabled,
        payoutsEnabled: stripeStatus.payoutsEnabled,
        detailsSubmitted: stripeStatus.detailsSubmitted,
        onboardingComplete:
          stripeStatus.detailsSubmitted && stripeStatus.chargesEnabled,
      },
    });

    return NextResponse.json({
      hasAccount: true,
      account: updatedAccount,
      stripeStatus: stripeStatus,
      user: {
        id: user.id,
        name: user.name,
        identifier: user.identifier,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("Error getting account status:", error);
    return NextResponse.json(
      { error: "Error al obtener estado de la cuenta" },
      { status: 500 }
    );
  }
}
