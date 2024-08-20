import { Stripe } from "stripe";
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

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

async function createCheckoutSessionService(
  user_id,
  cart,
  order,
  customer_email,
  domainURL
) {
  const existingOrder = await findPendingOrderByUserId(user_id);
  if (existingOrder) {
    return {
      message:
        "Bạn có đơn hàng chưa thanh toán, vui lòng thanh toán trước khi tạo đơn hàng mới!",
      prev_url: existingOrder.payment_url,
    };
  }

  const createNewOrder = await createOrder(user_id, order);

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
      unit_amount: item.product.price * 100,
    },
    quantity: item.count,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    customer_email,
    success_url: `${domainURL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/payment-cancel?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      order_id: createNewOrder._id.toString(),
      user_id: user_id,
    },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  await updateOrder(createNewOrder._id, { payment_url: session.url });

  return { url: session.url };
}

async function handleWebhook(data, eventType) {
  if (eventType === "checkout.session.completed") {
    const session = data.object;
    const order_id = session.metadata.order_id;
    const user_id = session.metadata.user_id;

    if (order_id) {
      await updateOrderStatus(order_id, "paid");
      const user = await getUserById(user_id);
      const cart_id = user.cart;
      await productService.updateProductSizeListFromCart(user_id);
      await clearCart(cart_id);
    }
  } else if (
    eventType === "invoice.payment_failed" ||
    eventType === "checkout.session.expired"
  ) {
    const session = data.object;
    const order_id = session.metadata.order_id;

    if (order_id) {
      await updateOrderStatus(order_id, "canceled");
    }
  }
}

async function retrieveCheckoutSession(sessionId) {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });
}

export { createCheckoutSessionService, handleWebhook, retrieveCheckoutSession };
