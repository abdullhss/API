import brandModel from "../../../DB/model/Brand.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const add = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  req.brand = await brandModel.create(req.body);
  return next();
});

export const update = asyncHandler(async (req, res, next) => {
  await req.brand.updateOne(req.body);
  return res.status(200).json({ message: "success" });
});

export const remove = asyncHandler(async (req, res, next) => {
  await req.brand.deleteOne();
  return res.status(200).json({ message: "success" });
});
