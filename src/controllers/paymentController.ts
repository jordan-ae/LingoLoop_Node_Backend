import Lesson from "../models/Lesson";
import { stripe } from "../utils/stripe";

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers.get('stripe-signature')!;
    const rawBody = await new Response(req.body).text();
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await Lesson.updateOne(
        { paymentIntentId: paymentIntent.id },
        { paymentStatus: 'paid' }
      );
    }

    res.status;
}