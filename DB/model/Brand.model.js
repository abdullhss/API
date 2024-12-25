import mongoose, { model, Schema, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: Object,
  },
  { timestamps: true }
);

const brandModel = model("Brand", brandSchema);

export default brandModel;
