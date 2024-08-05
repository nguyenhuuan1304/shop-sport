import dotenv from "dotenv";
import { Stripe } from "stripe";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_SECRET);
async function checkoutSession(req, res) {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
}
async function createCheckoutSession(req, res) {
  const domainURL = process.env.CLIENT_URL;
  const cart = req.body;
  const line_items = cart.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
        images: [item.product.images[0]],
        metadata: {
          id: item.product._id,
        },
      },
      unit_amount: item.product.price,
    },
    quantity: item.count,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: line_items,
      success_url: `${domainURL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/payment-cancel`,
    });

    // Trả về URL của phiên thanh toán dưới dạng JSON
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function webhook(req, res) {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);
  }

  res.sendStatus(200);
}
export { checkoutSession, createCheckoutSession, webhook };
