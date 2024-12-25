import couponModel from "../../../../DB/model/Coupon.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const addCoupon = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  const coupon = await couponModel.create(req.body);
  return res.json({ messgae: "Coupon Added Successfully", coupon });
});

export const getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel
    .findOne({ code: req.body.code })
    .populate("createdBy"); 
  return res.json({ messgae: "Coupon Returned Successfully", coupon });
});

export const getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await couponModel.find().populate("createdBy");
  return res.json({ messgae: "All Coupons Returned Successfully", coupons });
});

// use coupon for one time
export const useCoupon = asyncHandler(async (req, res, next) => {
  req.coupon.usages -= 1;
  req.coupon.users[req.user._id] += 1;
  const ret = await req.coupon.updateOne(req.coupon);
  return res.json({ messgae: "Coupon Updated Successfully", ret });
});

// update coupon data
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const ret = await req.coupon.updateOne(req.body);
  return res.json({ messgae: "Coupon Updated Successfully", ret });
});

export const removeCoupon = asyncHandler(async (req, res, next) => {
  await req.coupon.deleteOne();
  return res.json({ messgae: "Coupon Deleted Successfully" });
});
