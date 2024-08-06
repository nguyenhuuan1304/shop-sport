import dotenv from "dotenv";
import { orderService } from "../services/index.js";
import { Stripe } from "stripe";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_SECRET);
async function checkoutSession(req, res) {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const line_items = await stripe.checkout.sessions.listLineItems(sessionId);
  res.send({ session: session, line_items: line_items });
}
async function createCheckoutSession(req, res) {
  const domainURL = process.env.CLIENT_URL;
  const cart = req.body.cart;
  const customer_email = req.body.email;

  //create order with status = 'pending'
  const user_id = req.user.user_id;
  let order = req.body;
  //add expires_at 5 minutes
  // order = { ...order, expires_at: new Date(Date.now() + 2 * 60 * 1000) };
  const createOrder = await orderService.createOrder(user_id, order);
  if (!createOrder) {
    throw new Error("Failed to create order");
  }

  const line_items = cart?.map((item) => ({
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
      customer_email: customer_email,
      success_url: `${domainURL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/cart`,
      metadata: {
        order_id: createOrder?._id.toString(),
        user_id: user_id,
      },
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
    console.log(data);
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    const session = data.object;
    const order_id = session.metadata?.order_id;

    // console.log("Session metadata:", session.metadata);

    try {
      // Cập nhật trạng thái đơn hàng thành 'shipping'
      if (order_id) {
        await orderService.updateOrderStatus(order_id, "shipping");
        console.log(`Order ${order_id} status updated to 'shipping'.`);
      } else {
        console.log("Order ID not found in metadata.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }

    console.log(`🔔  Payment received!`);
  }

  // if (eventType === "checkout.session.expired") {
  //   const session = data.object;
  //   const order_id = session.metadata?.order_id;
  //   const user_id = session.metadata?.user_id;
  //   try {
  //     // delete order
  //     await orderService.deleteOrder(user_id, order_id);
  //     console.log("Order has been deleted.");
  //   } catch (err) {
  //     console.error("Error deleting order:", err);
  //   }
  // }
  res.sendStatus(200);
}
export { checkoutSession, createCheckoutSession, webhook };
