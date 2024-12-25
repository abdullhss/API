import { Router } from "express";
import auth from "../../middleware/auth.js";
import { add, clear, get, remove, update } from "./cart.controller.js";
import { isExist } from "../../middleware/isExist.js";
import productModel from "../../../DB/model/Product.model.js";
import {
  reqDataForms,
  uniqueFields,
  userRoles,
} from "../../utils/systemConstants.js";
import { checkQuantity, isProductExistInCart } from "./cart.middleware.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./cart.validation.js";
const router = Router();

// Get cart info
router.get("/", auth(), get);

// Add product to cart
router.post(
  "/",
  auth(),
  //validation(validator.add),
  isExist({
    model: productModel,
    dataFrom: reqDataForms.body,
    searchData: uniqueFields.productId,
  }),
  isProductExistInCart,
  checkQuantity,
  add
);
// update product quantity
router.put(
  "/:productId",
  auth([userRoles.User]),
  // validation(validator.update),
  isExist({
    model: productModel,
    dataFrom: reqDataForms.parmas,
    searchData: uniqueFields.productId,
  }),
  checkQuantity,
  update
);

// delete product from cart
router.delete(
  "/:productId",
  auth([userRoles.User]),
  // validation(validator.remove),
  isExist({
    model: productModel,
    dataFrom: reqDataForms.parmas,
    searchData: uniqueFields.productId,
  }),
  isProductExistInCart,
  remove
);

router.delete("/", auth([userRoles.User]), clear);

export default router;
