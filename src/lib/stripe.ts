import type Stripe from "stripe";

let _stripe: Stripe | null = null;

export async function getStripeClient(): Promise<Stripe> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️ STRIPE_SECRET_KEY is missing in your environment!");
  }
  
  if (!_stripe) {
    const { default: StripeClient } = await import("stripe");
    _stripe = new StripeClient(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiVersion: "2024-12-18.preview" as any,
      typescript: true,
    });
  }
  return _stripe!;
}
