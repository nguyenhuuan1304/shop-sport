import dotenv from "dotenv";
import {
  findPendingOrderByUserId,
  createOrder,
  updateOrder,
  updateOrderStatus,
} from "../order/order.service.js";
import { clearCart } from "../cart/cart.service.js";
import { getUserById } from "../user/user.service.js";
import { productService } from "../product/product.service.js";
import { Stripe } from "stripe";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_SECRET);
async function checkoutSession(req, res) {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });
  res.send({ session: session });
}
async function createCheckoutSession(req, res) {
  const domainURL = process.env.CLIENT_URL;
  const cart = req.body.cart;
  const customer_email = req.body.email;

  //create order with status = 'pending'
  const user_id = req.user.user_id;
  // Kiểm tra xem người dùng đã có session đang chờ thanh toán chưa
  const existingOrder = await findPendingOrderByUserId(user_id);
  console.log("existing order", existingOrder);
  if (existingOrder) {
    return res.json({
      message:
        "Bạn có đơn hàng chưa thanh toán, vui lòng thanh toán trước khi tạo đơn hàng mới!",
      prev_url: existingOrder.payment_url,
      // prev_url: `${domainURL}/profile/orders`,
    });
  }

  let order = req.body;
  const createNewOrder = await createOrder(user_id, order);
  if (!createNewOrder) {
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
      payment_method_types: ["card"],
      mode: "payment",
      line_items: line_items,
      customer_email: customer_email,
      success_url: `${domainURL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/payment-cancel?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        order_id: createNewOrder?._id.toString(),
        user_id: user_id,
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });
    //add payment_url = session.url
    await updateOrder(createNewOrder._id, {
      payment_url: session.url,
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
    // console.log(data);
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    const session = data.object;
    const order_id = session.metadata?.order_id;
    const user_id = session.metadata?.user_id;

    // console.log("Session metadata:", session.metadata);

    try {
      // Cập nhật trạng thái đơn hàng thành 'shipping'
      if (order_id) {
        await updateOrderStatus(order_id, "paid");
        // clear cart
        const user = await getUserById(user_id);
        const cart_id = user?.cart;
        console.log("cart_id", cart_id);
        await productService.updateProductSizeListFromCart(user_id);
        await clearCart(cart_id);

        console.log(`Order ${order_id} status updated to 'paid'.`);
      } else {
        console.log("Order ID not found in metadata.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }

    console.log(`🔔  Payment received!`);
  }

  if (
    eventType === "invoice.payment_failed" ||
    eventType === "checkout.session.expired"
  ) {
    const session = data.object;
    // console.log(session.metadata);
    const order_id = session.metadata?.order_id;
    const user_id = session.metadata?.user_id;
    try {
      if (order_id) {
        await updateOrderStatus(order_id, "canceled");
      }
      // delete order
      // await orderService.deleteOrder(user_id, order_id);
      // console.log("Order has been deleted.");
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  }
  res.sendStatus(200);
}
export { checkoutSession, createCheckoutSession, webhook };
