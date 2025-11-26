// /api/school/stripe-connect/create-account/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createConnectAccount } from "@/lib/stripe-connect";
import prisma from "@/generated/prisma";
import { UserType } from "@/generated/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== UserType.SELLER) {
      return NextResponse.json(
        {
          error:
            "No autorizado. Solo se puede crear cuentas para usuarios de tipo Vendedor.",
        },
        { status: 403 }
      );
    }

    // Get user profile with email
    const profile = await prisma.profile.findUnique({
      where: { userId: session.id as string },
    });

    if (!profile?.email) {
      return NextResponse.json(
        {
          error:
            "Debes completar tu perfil con un email antes de configurar pagos.",
        },
        { status: 400 }
      );
    }

    // Create or get existing Connect account
    const connectAccount = await createConnectAccount(
      session.id as string,
      profile.email
    );

    return NextResponse.json({
      success: true,
      account: {
        id: connectAccount.id,
        stripeAccountId: connectAccount.stripeAccountId,
        accountStatus: connectAccount.accountStatus,
        onboardingComplete: connectAccount.onboardingComplete,
      },
    });
  } catch (error) {
    console.error("Error creating Stripe Connect account:", error);
    return NextResponse.json(
      { error: "Error al crear cuenta de vendedor" },
      { status: 500 }
    );
  }
}
