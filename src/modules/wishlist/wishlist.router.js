import { Router } from "express";
import {
  addToWishlist,
  deleteFromWishlist,
  getwish,
} from "./wishlist.controller.js";
import auth from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const wishlistRouter = Router();

// add to wishlist
wishlistRouter.post("/", auth(), asyncHandler(addToWishlist));

wishlistRouter.delete("/:productId", auth(), asyncHandler(deleteFromWishlist));
wishlistRouter.get("/", auth(), asyncHandler(getwish));
export default wishlistRouter;
