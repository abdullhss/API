import { Schema, Types, model } from "mongoose";
const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: Object,
        id: {
          type: Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
cartSchema.virtual("noProduct").get(function () {
  return this.products.length;
});

const cartModel = model("Cart", cartSchema);
export default cartModel;
