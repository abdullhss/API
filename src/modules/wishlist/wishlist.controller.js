import { ModifyError } from "../../utils/classError.js";
import productModel from "../../../DB/model/Product.model.js";
import userModel from "../../../DB/model/User.model.js";

// add to wishlist
export const addToWishlist = async (req, res, next) => {
  // get data from req
  let { productId } = req.body;
  // check product exist
  const productExist = await productModel.findById(productId);
  if (!productExist) {
    return next(new ModifyError(messages.product.notFound, 404));
  }

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  );
  return res.status(200).json({
    status: "success",
    message: "Product added to wishList",
    success: true,
    data: user.wishlist,
  });
};
export const deleteFromWishlist = async (req, res, next) => {
  // get data from req
  const { productId } = req.params;
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: productId },
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    status: "success",
    message: "Product removed from wishlist",
    success: true,
    data: user.wishlist,
  });
};

export const getwish = async (req, res) => {
  await req.user.populate("wishlist");

  const products = req.user.wishlist;
  const data = products.map((ele) => {
    const images = ele._doc.images.map((ele) => {
      return ele.secure_url;
    });
    return {
      ...ele._doc,
      title: ele._doc.name,
      imageCover: ele._doc.imageCover.secure_url,
      images,
      ratingsQuantity: ele._doc.noRating,
      ratingsAverage: ele._doc.totalRating / (ele._doc.noRating || 1),
    };
  });
  return res.json({ status: "success", data });
};
