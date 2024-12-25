import { Schema, Types, model } from "mongoose";
import cloudinary from "../../src/utils/cloudinary.js";
const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: Object,
  },
  {
    timestamps: true,
  }
);

subcategorySchema.pre("deleteMany", async function () {
  const subcategories = await subcategoryModel.find({
    categoryId: this.getFilter().categoryId,
  });
  for (const subcategory of subcategories) {
    if (subcategory.image)
      await cloudinary.api.delete_resources_by_prefix(
        `web-project-ecommerce/subcategory/${subcategory._id}`
      );
  }
});

const subcategoryModel = model("Subcategory", subcategorySchema);
export default subcategoryModel;
