import { Router } from "express";
import * as couponContoller from "./controller/coupon.js";
import * as validator from "./coupon.validation.js";
import couponModel from "../../../DB/model/Coupon.model.js";
import auth from "../../middleware/auth.js";
import { isNotExist } from "../../middleware/isNotExist.js";
import { isExist } from "../../middleware/isExist.js";
import { isOwner } from "../../middleware/isOwner.js";
import { reqDataForms, uniqueFields, userRoles } from "../../utils/systemConstants.js";
import { IdValidator, validation } from "../../middleware/validation.js";

const router = Router();

router.get(
  "/getByCode",
  auth(),
  validation(validator.code),
  isExist({
    model: couponModel,
    dataFrom: reqDataForms.body,
    searchData: uniqueFields.couponCode,
    isId: false,
  }),
  couponContoller.getCoupon
);

router
  .route("/")
  .get(auth(), couponContoller.getAllCoupons)
  .post(
    auth([userRoles.Admin]),
    validation(validator.add),
    isNotExist({ model: couponModel, searchData: uniqueFields.couponCode }),
    couponContoller.addCoupon
  );

router
  .route("/:_id")
  .put(
    auth([userRoles.Admin]),
    validation(validator.update),
    isExist({
      model: couponModel,
      dataFrom: reqDataForms.parmas,
      searchData: uniqueFields.id,
    }),
    isOwner(couponModel),
    isNotExist({ model: couponModel, searchData: uniqueFields.couponCode }),
    couponContoller.updateCoupon
  )
  .delete(
    auth([userRoles.Admin]),
    validation(IdValidator),
    isExist({
      model: couponModel,
      dataFrom: reqDataForms.parmas,
      searchData: uniqueFields.id,
    }),
    isOwner(couponModel),
    couponContoller.removeCoupon
  );

export default router;
