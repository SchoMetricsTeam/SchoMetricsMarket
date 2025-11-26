import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { stripe } from "@/lib/stripe";
import { UserType } from "@/generated/prisma/client";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.userType !== UserType.SELLER) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
      include: { stripeAccount: true, profile: true },
    });

    if (!user?.stripeAccount) {
      return NextResponse.json(
        { error: "No tienes una cuenta de Stripe Connect" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { email, businessProfile, phone } = body;

    // Update Stripe account using official stripe.accounts.update() method
    const updateData: any = {};

    // Update email if provided
    if (email && email !== user.profile?.email) {
      updateData.email = email;
    }

    // Update business profile (support_email, support_phone, support_url, name, etc.)
    if (businessProfile) {
      updateData.business_profile = {};

      if (businessProfile.support_email) {
        updateData.business_profile.support_email =
          businessProfile.support_email;
      }

      if (businessProfile.support_phone) {
        updateData.business_profile.support_phone =
          businessProfile.support_phone;
      }

      if (businessProfile.support_url) {
        updateData.business_profile.support_url = businessProfile.support_url;
      }

      if (businessProfile.name) {
        updateData.business_profile.name = businessProfile.name;
      }

      if (businessProfile.product_description) {
        updateData.business_profile.product_description =
          businessProfile.product_description;
      }
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await stripe.accounts.update(
        user.stripeAccount.stripeAccountId,
        updateData
      );
    }

    // Sync with database - update profile if email or phone changed
    if ((email || phone) && user.profile) {
      const profileUpdate: any = {};

      if (email && email !== user.profile.email) {
        profileUpdate.email = email;
      }

      if (phone && phone !== user.profile.phone) {
        profileUpdate.phone = phone;
      }

      if (Object.keys(profileUpdate).length > 0) {
        await prisma.profile.update({
          where: { userId: session.id as string },
          data: profileUpdate,
        });
      }
    }

    return NextResponse.json({
      message: "Cuenta actualizada exitosamente",
      success: true,
    });
  } catch (error) {
    console.error("Error updating Stripe account:", error);
    return NextResponse.json(
      { error: "Error al actualizar la cuenta" },
      { status: 500 }
    );
  }
}
