// /api/stripe/webhook/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import prisma from "@/generated/prisma";
import { PaymentStatus } from "@/generated/prisma/client";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`Webhook recibido: ${event.type}`);

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(` PaymentIntent ${paymentIntent.id} succeeded!`);

      try {
        const purchase = await prisma.materialPurchase.findFirst({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
        });

        if (purchase) {
          // Solo actualizar si aún está PENDING
          if (purchase.paymentStatus === PaymentStatus.PENDING) {
            await prisma.materialPurchase.update({
              where: { id: purchase.id },
              data: {
                paymentStatus: PaymentStatus.COMPLETED,
                paymentMethod: "stripe",
              },
            });

            console.log(`✓ Purchase ${purchase.id} marked as COMPLETED`);
            console.log(
              ` Transfer to seller: ${purchase.sellerAmount} MXN | Platform fee: ${purchase.platformFeeAmount} MXN`
            );
          } else {
            console.log(
              `Purchase ${purchase.id} already in status: ${purchase.paymentStatus}`
            );
          }
        } else {
          console.warn(
            `⚠ No purchase found for PaymentIntent ${paymentIntent.id}`
          );
        }
      } catch (error) {
        console.error(
          `Error updating purchase for PaymentIntent ${paymentIntent.id}:`,
          error
        );
      }
      break;

    case "payment_intent.amount_capturable_updated":
      const capturableIntent = event.data.object;
      console.log(
        ` PaymentIntent ${capturableIntent.id} is ready to be captured`
      );
      // Este evento se dispara cuando un PaymentIntent con capture_method: manual está listo
      // No necesitamos hacer nada aquí, solo logging
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      console.log(` PaymentIntent ${failedPayment.id} failed!`);

      try {
        const purchase = await prisma.materialPurchase.findFirst({
          where: {
            stripePaymentIntentId: failedPayment.id,
          },
        });

        if (purchase) {
          await prisma.$transaction(async (tx) => {
            await tx.materialPurchase.update({
              where: { id: purchase.id },
              data: { paymentStatus: PaymentStatus.FAILED },
            });

            await tx.recyclableMaterial.update({
              where: { id: purchase.materialId },
              data: { status: "AVAILABLE" },
            });
          });

          console.log(
            ` Purchase ${purchase.id} marked as FAILED and material released`
          );
        }
      } catch (error) {
        console.error(
          ` Error handling failed payment for PaymentIntent ${failedPayment.id}:`,
          error
        );
      }
      break;

    case "payment_intent.canceled":
      const canceledPayment = event.data.object;
      console.log(` PaymentIntent ${canceledPayment.id} was canceled`);

      try {
        const purchase = await prisma.materialPurchase.findFirst({
          where: {
            stripePaymentIntentId: canceledPayment.id,
          },
        });

        if (purchase) {
          await prisma.$transaction(async (tx) => {
            if (purchase.paymentStatus === PaymentStatus.PENDING) {
              await tx.materialPurchase.delete({
                where: { id: purchase.id },
              });

              await tx.recyclableMaterial.update({
                where: { id: purchase.materialId },
                data: { status: "AVAILABLE" },
              });

              console.log(
                ` Canceled purchase ${purchase.id} removed and material released`
              );
            } else {
              console.log(
                ` Purchase ${purchase.id} already ${purchase.paymentStatus}, not canceling`
              );
            }
          });
        }
      } catch (error) {
        console.error(
          ` Error handling canceled payment for PaymentIntent ${canceledPayment.id}:`,
          error
        );
      }
      break;

    case "charge.refunded":
      const refundedCharge = event.data.object;
      console.log(` Charge ${refundedCharge.id} was refunded`);

      try {
        const purchase = await prisma.materialPurchase.findFirst({
          where: {
            stripePaymentIntentId: refundedCharge.payment_intent as string,
          },
        });

        if (purchase) {
          await prisma.$transaction(async (tx) => {
            await tx.materialPurchase.update({
              where: { id: purchase.id },
              data: { paymentStatus: PaymentStatus.FAILED },
            });

            await tx.recyclableMaterial.update({
              where: { id: purchase.materialId },
              data: { status: "AVAILABLE" },
            });
          });

          console.log(
            ` Refunded purchase ${purchase.id} marked as FAILED and material released`
          );
        }
      } catch (error) {
        console.error(
          ` Error handling refunded charge ${refundedCharge.id}:`,
          error
        );
      }
      break;

    case "account.updated":
      const account = event.data.object;
      console.log(` Stripe Connect account ${account.id} updated`);

      try {
        const connectAccount = await prisma.stripeConnectAccount.findUnique({
          where: { stripeAccountId: account.id },
        });

        if (connectAccount) {
          await prisma.stripeConnectAccount.update({
            where: { id: connectAccount.id },
            data: {
              chargesEnabled: account.charges_enabled || false,
              payoutsEnabled: account.payouts_enabled || false,
              detailsSubmitted: account.details_submitted || false,
              onboardingComplete:
                (account.charges_enabled &&
                  account.payouts_enabled &&
                  account.details_submitted) ||
                false,
              accountStatus:
                account.charges_enabled && account.payouts_enabled
                  ? "ACTIVE"
                  : "PENDING",
            },
          });

          console.log(` Connect account ${connectAccount.id} status updated`);
        }
      } catch (error) {
        console.error(` Error updating Connect account ${account.id}:`, error);
      }
      break;

    default:
      console.log(` Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
