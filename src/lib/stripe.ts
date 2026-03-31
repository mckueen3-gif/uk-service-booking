let _stripe: any = null;

export async function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️ STRIPE_SECRET_KEY is missing in your environment!");
  }
  
  if (!_stripe) {
    const { default: Stripe } = await import("stripe");
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
      apiVersion: "2026-02-25.clover" as any,
      typescript: true,
    });
  }
  return _stripe;
}
