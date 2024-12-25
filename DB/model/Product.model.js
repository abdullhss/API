import * as mongo from "mongoose";
import reviewModel from "./Review.model.js";

const productSchema = new mongo.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
    },
    description: {
      type: String,
      // required: [true, "Description is required"],
      min: [1, "Min length is 1 char"],
      max: [500, "Max length is 500 char"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    subcategoryId: {
      type: mongo.Types.ObjectId,
      ref: "Subcategory",
      // required: [true, "subCategory is required"],
    },
    category: {
      type: mongo.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: { type: Number, default: 1 },
    totalSold: { type: Number, default: 0 },
    totalSoldPrice: { type: Number, default: 0 },
    createdBy: { type: mongo.Types.ObjectId, ref: "User", required: true },
    brandId: {
      type: mongo.Types.ObjectId,
      ref: "Brand",
      // required: [true, "Brand is required"],
    },
    noRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    color: [String],
    size: [String],
    images: [Object],
    imageCover: {
      type: Object,
      default: {
        public_id: "123",
        secure_url:
          "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("avgRating").get(function () {
  // console.log(this);
  if (this.noRating == 0) return 0;
  return this.totalRating / this.noRating;
});

productSchema.method("check_Stock", function (quantity) {
  return quantity <= this.stock;
});

productSchema.post("deleteOne", async function () {
  // delete the reviews related to this product
  await reviewModel.deleteMany({ productId: this.getFilter()._id });
});

const productModel = mongo.model("Product", productSchema);
export default productModel;
