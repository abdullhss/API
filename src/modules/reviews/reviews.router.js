import { Router } from "express";
import * as reviewsController from "./controller/review.js";
import auth from "../../middleware/auth.js";
import { isExist } from "../../middleware/isExist.js";
import productModel from "../../../DB/model/Product.model.js";
import {
  reqDataForms,
  uniqueFields,
  userRoles,
} from "../../utils/systemConstants.js";
import { isNotExist } from "../../middleware/isNotExist.js";
import reviewModel from "../../../DB/model/Review.model.js";
import { isOwner } from "../../middleware/isOwner.js";
import orderModel from "../../../DB/model/Order.model.js";

const router = Router();

// router.get("/", (req, res) => res.json({ mesasge: `${req.originalUrl} Page` }));

// should be the id of the product
router.get(
  "/:_id",
  auth(),
  isExist({
    model: productModel,
    dataFrom: reqDataForms.parmas,
    searchData: uniqueFields.id,
  }),
  reviewsController.getReviewsOfProduct
);

router.get("/", auth(), reviewsController.getReviews);

router.post(
  "/",
  auth([userRoles.User]),
  // isNotExist({
  //   model: reviewModel,
  //   searchData: "createdBy",
  // }),
  // isExist({
  //   model: orderModel,
  //   dataFrom: reqDataForms.body,
  //   searchData: uniqueFields.orderId,
  // }),
  reviewsController.addReview
);

router.put(
  "/:_id",
  auth([userRoles.User]),
  isExist({
    model: reviewModel,
    dataFrom: reqDataForms.parmas,
    searchData: uniqueFields.id,
  }),
  isOwner(reviewModel),
  isExist({
    model: productModel,
    dataFrom: reqDataForms.body,
    searchData: uniqueFields.productId,
  }),
  reviewsController.updateReview
);

router.delete(
  "/:_id",
  auth([userRoles.User]),
  isExist({
    model: reviewModel,
    dataFrom: reqDataForms.parmas,
    searchData: uniqueFields.id,
  }),
  isOwner(reviewModel),
  isExist({
    model: productModel,
    dataFrom: reqDataForms.body,
    searchData: uniqueFields.productId,
  }),
  reviewsController.deleteReview
);

export default router;
