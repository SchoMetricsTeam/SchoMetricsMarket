// /api/seller/stripe-connect/account-status/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAccountStatus } from "@/lib/stripe-connect";
import prisma from "@/generated/prisma";
import { UserType } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== UserType.SELLER) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const connectAccount = await prisma.stripeConnectAccount.findUnique({
      where: { userId: session.id as string },
    });

    if (!connectAccount) {
      return NextResponse.json({
        success: true,
        hasAccount: false,
        accountStatus: null,
      });
    }

    const status = await getAccountStatus(connectAccount.stripeAccountId);

    // Update database with latest status
    await prisma.stripeConnectAccount.update({
      where: { id: connectAccount.id },
      data: {
        chargesEnabled: status.chargesEnabled,
        payoutsEnabled: status.payoutsEnabled,
        detailsSubmitted: status.detailsSubmitted,
        onboardingComplete:
          status.chargesEnabled &&
          status.payoutsEnabled &&
          status.detailsSubmitted,
        accountStatus:
          status.chargesEnabled && status.payoutsEnabled ? "ACTIVE" : "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      hasAccount: true,
      accountStatus: connectAccount.accountStatus,
      chargesEnabled: status.chargesEnabled,
      payoutsEnabled: status.payoutsEnabled,
      detailsSubmitted: status.detailsSubmitted,
      onboardingComplete:
        status.chargesEnabled &&
        status.payoutsEnabled &&
        status.detailsSubmitted,
      requirementsCurrentlyDue: status.requirementsCurrentlyDue,
      requirementsEventuallyDue: status.requirementsEventuallyDue,
    });
  } catch (error) {
    console.error("Error fetching account status:", error);
    return NextResponse.json(
      { error: "Error al obtener estado de la cuenta" },
      { status: 500 }
    );
  }
}
