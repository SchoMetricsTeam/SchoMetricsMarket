import { stripe } from "@/lib/stripe";
import prisma from "@/generated/prisma";

export const PLATFORM_FEE_PERCENTAGE = 0.2;

/**
 * Creates a Stripe Connect account for a school
 */
export async function createConnectAccount(userId: string, email: string) {
  try {
    // Check if account already exists
    const existingAccount = await prisma.stripeConnectAccount.findUnique({
      where: { userId },
    });

    if (existingAccount) {
      return existingAccount;
    }

    // Create Stripe Connect Account (Express type)
    const account = await stripe.accounts.create({
      type: "express",
      country: "MX",
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "non_profit", // Sellers are typically non-profit
      metadata: {
        userId: userId,
        userType: "SCHOOL",
      },
    });

    // Save to database
    const connectAccount = await prisma.stripeConnectAccount.create({
      data: {
        userId,
        stripeAccountId: account.id,
        accountStatus: "PENDING",
        chargesEnabled: account.charges_enabled || false,
        payoutsEnabled: account.payouts_enabled || false,
        detailsSubmitted: account.details_submitted || false,
        onboardingComplete: false,
      },
    });

    return connectAccount;
  } catch (error) {
    console.error("Error creating Stripe Connect account:", error);
    throw error;
  }
}

/**
 * Creates an onboarding link for a seller to complete their Stripe account setup
 */
export async function createAccountLink(
  stripeAccountId: string,
  refreshUrl: string,
  returnUrl: string
) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    return accountLink;
  } catch (error) {
    console.error("Error creating account link:", error);
    throw error;
  }
}

/**
 * Retrieves the status of a Stripe Connect account
 */
export async function getAccountStatus(stripeAccountId: string) {
  try {
    const account = await stripe.accounts.retrieve(stripeAccountId);

    return {
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      detailsSubmitted: account.details_submitted || false,
      requirementsCurrentlyDue: account.requirements?.currently_due || [],
      requirementsEventuallyDue: account.requirements?.eventually_due || [],
    };
  } catch (error) {
    console.error("Error getting account status:", error);
    throw error;
  }
}

/**
 * Calculates platform fee and school amount
 */
export function calculateFees(totalAmount: number) {
  const platformFee = Math.round(totalAmount * PLATFORM_FEE_PERCENTAGE);
  const sellerAmount = totalAmount - platformFee;

  return {
    platformFeeAmount: platformFee,
    sellerAmount: sellerAmount,
  };
}

/**
 * Creates a payment with Stripe Connect and application fee
 */
export async function createPaymentWithConnect(
  amount: number,
  connectedAccountId: string,
  metadata: Record<string, string>
) {
  try {
    const { platformFeeAmount } = calculateFees(amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "mxn",
      application_fee_amount: platformFeeAmount,
      transfer_data: {
        destination: connectedAccountId,
      },
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment with Connect:", error);
    throw error;
  }
}
