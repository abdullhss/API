import { Schema, Types, model } from "mongoose";
import { orderStatus, paymentMehods } from "../../src/utils/systemConstants.js";
const orderSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      lowercase: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        id: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.watting_for_payment,
    },
    descount: {
      type: Number,
      default: 0,
    },
    paymentMehod: {
      type: String,
      enum: Object.values(paymentMehods),
      default: paymentMehods.cash,
    },
    phone: { type: String, required: true },
    paymentIntent: String,
    couponId: { type: Types.ObjectId, ref: "Coupon" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

orderSchema.virtual("totalPrice").get(function () {
  let price = 0;
  this.products.forEach((prod) => {
    price += prod.quantity * prod.price;
  });
  return price;
});

orderSchema.virtual("totalPriceAfterDescount").get(function () {
  return this.totalPrice - (this.totalPrice * this.descount) / 100;
});

const orderModel = model("Order", orderSchema);
export default orderModel;
