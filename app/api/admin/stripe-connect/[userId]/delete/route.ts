import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/generated/prisma";
import { stripe } from "@/lib/stripe";
import { UserType } from "@/generated/prisma/client";

export async function DELETE(
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
        { error: "Este usuario no tiene cuenta de Stripe Connect" },
        { status: 404 }
      );
    }

    // Delete Stripe account
    try {
      await stripe.accounts.del(user.stripeAccount.stripeAccountId);
    } catch (stripeError) {
      console.error("Error deleting Stripe account:", stripeError);
      // Continue with database deletion even if Stripe deletion fails
    }

    // Delete from database
    await prisma.stripeConnectAccount.delete({
      where: { id: user.stripeAccount.id },
    });

    return NextResponse.json({
      message: "Cuenta de Stripe Connect eliminada exitosamente",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting Stripe Connect account:", error);
    return NextResponse.json(
      { error: "Error al eliminar la cuenta de Stripe Connect" },
      { status: 500 }
    );
  }
}
