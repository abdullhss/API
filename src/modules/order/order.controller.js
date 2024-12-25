import orderModel from "../../../DB/model/Order.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import Stripe from "stripe";
import { orderStatus } from "../../utils/systemConstants.js";
import productModel from "../../../DB/model/Product.model.js";
import { sendEmail } from "../../utils/email.js";
import { ModifyError } from "../../utils/classError.js";
import { StatusCodes } from "http-status-codes";

export const create = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ status: "success", order: req.order });
});

export const cancel = asyncHandler(async (req, res, next) => {
  // return the products to stock
  console.log(req.order);
  for (const product of req.order.products) {
    await productModel.updateOne(
      {
        _id: product.id,
      },
      {
        $inc: { stock: product.quantity },
      }
    );
  }

  // change the status to refunded
  req.order.status = orderStatus.Refunded;
  await req.order.save();

  return res.status(200).json({ status: "success", refund: req.order.refund });
});

export const webhook = asyncHandler(async (request, response) => {
  const stripe = new Stripe(process.env.PAYMENT_SECRET_KEY);
  const endpointSecret = process.env.ENDPOINT_SECRET;
  const sig = request.headers["stripe-signature"];

  let event = event.data.object.metadata;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // ... handle other event types

      break;
    case "charge.refunded":
      return response.json;
      // ... handle other event types
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);

      return resizeBy;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

export const getOrders = async (req, res, next) => {
  const orders = await orderModel
    .find({ createdBy: req.user._id })
    .populate("products.id");

  const order = orders.map((order) => {
    const products = order.products.filter((product) => product.id);
    return {
      cartItems: products.map((ele) => {
        const images = ele.id._doc.images.map((ele) => {
          return ele.secure_url;
        });
        return {
          product: {
            ...ele.id._doc,
            title: ele.id._doc.name,
            imageCover: ele.id._doc.imageCover.secure_url,
            images,
          },
          count: ele.quantity,
          price: ele.price,
        };
      }),
      paymentMethodType: order.paymentMehod,
      totalOrderPrice: order.totalPrice,
      isDelivered: false,
      isPaid: true,
    };
  });

  const data = order.filter((order) => order.cartItems.length);

  return orders.length
    ? res.status(200).json({ message: "success", data })
    : next(new ModifyError("no orders found", StatusCodes.NOT_FOUND));
};
