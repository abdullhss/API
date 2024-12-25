import { Schema, Types, model } from "mongoose";
import subcategoryModel from "./Subcategory.model.js";
const categorySchema = new Schema(
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
    image: Object,
  },
  {
    timestamps: true,
  }
);

categorySchema.post("deleteOne", async function () {
  console.log("category");
  await subcategoryModel.deleteMany({ categoryId: this.getFilter()._id });
});

const categoryModel = model("Category", categorySchema);
export default categoryModel;
