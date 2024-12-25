import { StatusCodes } from "http-status-codes";
import { ModifyError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const couponValidity = asyncHandler(async (req, res, next) => {
  // if user not use coupon
  if (!req.coupon) return next();

  if (req.coupon.usages <= 0) {
    return next(new ModifyError(`coupon is not active`, StatusCodes.FORBIDDEN));
  }

  const dateNow = new Date();
  const dateCoupon = new Date(req.coupon.expireDate);

  if (dateNow > dateCoupon)
    return next(new ModifyError(`coupon is expired`, StatusCodes.BAD_REQUEST));

  next();
});

export const userValidity = asyncHandler(async (req, res, next) => {
  // if user not use coupon
  if (!req.coupon) return next();

  if (!req.coupon.users[req.user._id]) {
    req.coupon.users[req.user._id] = 0;
  }
  if (req.coupon.users[req.user._id] >= req.coupon.limit) {
    return next(
      new ModifyError(
        `user reach his limit to use this coupon`,
        StatusCodes.FORBIDDEN
      )
    );
  }
  next();
});
