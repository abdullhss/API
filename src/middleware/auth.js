import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { userRoles, userStatus } from "../utils/systemConstants.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { ModifyError } from "../utils/classError.js";
import { StatusCodes } from "http-status-codes";
import cartModel from "../../DB/model/Cart.model.js";
import productModel from "../../DB/model/Product.model.js";

const auth = (roles = Object.values(userRoles)) => {
  return asyncHandler(async (req, res, next) => {
    // constract token from headers
    let { token } = req.headers;
    if (!token)
      return next(
        new ModifyError("token must be entered", StatusCodes.BAD_REQUEST)
      );

    // // validate the beaerer key
    // if (!token.startsWith(process.env.BEARER_KEY))
    //   return next(
    //     new ModifyError("invalid bearer key", StatusCodes.BAD_REQUEST)
    //   );

    // split the bearer key from original token =>  "bearer_token" => ["","token"]
    // token = token.split(process.env.BEARER_KEY)[1];

    // constract id from token
    const { id } = jwt.verify(token, process.env.TOKEN_SIGNATURE);
    if (!id)
      return next(new ModifyError("invalid payload", StatusCodes.BAD_REQUEST));

    // check if the user exist or not
    const user = await userModel.findById(id);
    if (!user)
      return next(new Error("user id doesn't exist", StatusCodes.NOT_FOUND));

    // check the user authorization
    if (!roles.includes(user.role))
      return next(
        new Error("You are not authorized", StatusCodes.UNAUTHORIZED)
      );

    // check if user blocked
    if (user.status == userStatus.Blocked)
      return next(
        new Error(
          "Your account has been blocked, contact us",
          StatusCodes.FORBIDDEN
        )
      );

    // check if user offline
    if (user.status == userStatus.Offline)
      return next(
        new ModifyError("You need to login again", StatusCodes.BAD_REQUEST)
      );

    // Get user cart
    let cart = await cartModel.findOne({ userId: user._id });

    // if user doesn't have cart
    if (!cart) cart = await cartModel.create({ userId: user._id });

    if (cart.products.length) {
      for (const product of cart.products) {
        product.id = await productModel.findById(product.id);
      }
    }

    // add the user cart object to the request object so it can be accessed throw the other middlewares
    req.cart = cart;

    // add the user object to the request object so it can be accessed throw the other middlewares
    req.user = user;

    console.log("auth");
    // move to the next middleware
    return next();
  });
};

export default auth;
