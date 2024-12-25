import mongoose, * as mongo from "mongoose";

const reviewSchema = new mongo.Schema(
  {
    createdBy: {
      type: mongo.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy is required"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [1, "You should choose from 1 to 5 stars"],
      max: [5, "You should choose from 1 to 5 stars"],
    },
    review: {
      type: String,
      required: [true, "Review is required"],
      min: [1, "Min length is 1 char"],
      max: [100, "Max length is 100 char"],
    },
    // productId: {
    //     type: mongo.Types.ObjectId,
    //     required: [true, "productId is required"],
    //     ref: "Product"
    // }
    sellerId: {
      type: mongo.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderId: {
      type: mongo.Types.ObjectId,
      required: true,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongo.model("Review", reviewSchema);
export default reviewModel;
