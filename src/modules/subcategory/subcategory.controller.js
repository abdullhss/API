import { StatusCodes } from "http-status-codes";
import subcategoryModel from "../../../DB/model/Subcategory.model.js";
import { ModifyError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const add = asyncHandler(async (req, res, next) => {
  req.body.categoryId = req.params.categoryId;
  req.body.createdBy = req.user._id;
  req.subcategory = await subcategoryModel.create(req.body);
  return next();
});

export const remove = asyncHandler(async (req, res, next) => {
  await req.subcategory.deleteOne();
  return res.status(200).json({ message: "success" });
});

export const update = asyncHandler(async (req, res, next) => {
  await req.subcategory.updateOne(req.body);
  return res.status(200).json({ message: "success" });
});

export const getCategorySubcategory = asyncHandler(async (req, res, next) => {
  const cagtegories = await subcategoryModel.find({
    categoryId: req.params._id,
  });
  return cagtegories.length
    ? res.status(200).json({ message: "success", cagtegories })
    : next(new ModifyError("no sub catgeory found", StatusCodes.NOT_FOUND));
});
