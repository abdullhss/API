import { asyncHandler } from "../../utils/errorHandling.js";
import { ModifyError } from "../../utils/classError.js";
import { StatusCodes } from "http-status-codes";

/*
two conditions:
1- product is in cart already
2- product isn't in cart
*/

export const isProductExistInCart = asyncHandler(async (req, res, next) => {
  // check if the product is already in the cart
  req.cart.products.forEach((ele) => {
    if (ele.id?._id.toString() == req.params.productId) {
      req.body.quantity += ele.quantity;
      req.body.productExist = true;
      return;
    }
  });
  next();
});

export const checkQuantity = asyncHandler(async (req, res, next) => {
  // check the quantity that user delivered
  const isStockEnough = req.product.check_Stock(req.body.quantity || 1);

  if (!isStockEnough) {
    return next(
      new ModifyError(
        "The stock is empty or the quantity is larger than the stock",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  next();
});

export const isCartEmpty = asyncHandler(async (req, res, next) => {
  if (!req.cart.products.length) {
    // console.log(req.cart);
    console.log("isCartinsideIf");
    return next(new ModifyError("The cart is empty", StatusCodes.BAD_REQUEST));
  }
  console.log("isCartoutsideIf");
  return next();
});
