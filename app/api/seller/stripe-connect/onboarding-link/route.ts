// /api/school/stripe-connect/onboarding-link/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAccountLink } from "@/lib/stripe-connect";
import prisma from "@/generated/prisma";
import { UserType } from "@/generated/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.userType !== UserType.SELLER) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const connectAccount = await prisma.stripeConnectAccount.findUnique({
      where: { userId: session.id as string },
    });

    if (!connectAccount) {
      return NextResponse.json(
        { error: "Primero debes crear una cuenta de vendedor" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const refreshUrl = `${baseUrl}/vendedor/publicar-materiales?refresh=true`;
    const returnUrl = `${baseUrl}/vendedor/publicar-materiales?success=true`;

    const accountLink = await createAccountLink(
      connectAccount.stripeAccountId,
      refreshUrl,
      returnUrl
    );

    // Update onboarding link in database
    await prisma.stripeConnectAccount.update({
      where: { id: connectAccount.id },
      data: {
        onboardingLink: accountLink.url,
        onboardingExpiresAt: new Date(accountLink.expires_at * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      url: accountLink.url,
    });
  } catch (error) {
    console.error("Error creating onboarding link:", error);
    return NextResponse.json(
      { error: "Error al generar enlace de configuración" },
      { status: 500 }
    );
  }
}
