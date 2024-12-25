import { Router } from "express";
import auth from "../../middleware/auth.js";
import * as orderMiddleware from "./order.middleware.js";
import * as orderController from "./order.controller.js";
import { isExist } from "../../middleware/isExist.js";
import orderModel from "../../../DB/model/Order.model.js";
import {
  reqDataForms,
  uniqueFields,
  userRoles,
} from "../../utils/systemConstants.js";
import { isOwner } from "../../middleware/isOwner.js";
import couponModel from "../../../DB/model/Coupon.model.js";
import * as couponMiddleware from "../coupon/coupon.middleware.js";
import { isCartEmpty } from "../cart/cart.middleware.js";
import { ModifyError } from "../../utils/classError.js";
import { StatusCodes } from "http-status-codes";
import cartModel from "../../../DB/model/Cart.model.js";
import productModel from "../../../DB/model/Product.model.js";
import Stripe from "stripe";

const router = Router();

router.get("/", auth(), orderController.getOrders);

// Generate order

/*
========================= ORDER PROCESS =========================
1- check if the products exist and there's stock enough 
2- if does update stock and empty the cart and produce to the order process 
3- (if user use coupoun) check if this coupon still exist in DB and valid to use
4- (in case user use cash as payment method) make status of the order shipping 
5- (in case user use card as payment method) integrate with Stripe gateway to create payment link and make status of the order wait_for_payment
6- return response to user with information about order (cash) or payment link (card)
*/
router.post(
  "/",
  auth([userRoles.User]),
  isCartEmpty,
  orderMiddleware.isProductsOrder,
  orderMiddleware.orderCash,
  orderController.create
);

// payment gateway
router.post("/webhook", orderController.webhook);

// if user want to cancel the order
router.put(
  "/:_id",
  auth([userRoles.User]),
  isExist({
    model: orderModel,
    dataFrom: reqDataForms.parmas,
    searchData: uniqueFields.id,
  }),
  isOwner(orderModel),
  orderMiddleware.refund,
  orderController.cancel
);

// router.post("/webhook", async (req, res) => {
//   const sig = req.headers["stripe-signature"].toString();
//   const stripe = new Stripe(
//     "sk_test_51NlrAeGR9Ya7i8epSwqhE8bvXjh7kUmpI3qmGi1m7sLhJYddjhrO8aPkgphH5NGFxk6gDs7pkPL47XDZGiGE0aJW004YK9FoM2"
//   );
//   let event;

//   event = stripe.webhooks.constructEvent(
//     req.body,
//     sig,
//     "whsec_bMewvPkLENhPOB59Ix5jq6Vis3TaPNYV"
//   );

//   if (event.type == "checkout.session.completed") {
//     console.log(event);

//     const object = event.data.object;
//     // logic
//     // cart
//     console.log(object.client_reference_id);

//     const cart = await cartModel.findById(object.client_reference_id);
//     for (const product of cart.products) {
//       await productModel.findByIdAndUpdate(product.productId, {
//         $set: { $inc: { stock: -product.quantity } },
//       });
//     }
//     cart.products = [];
//     await cart.save();
//   }
//   // Return a 200 res to acknowledge receipt of the event
//   res.send();
// });

export default router;
