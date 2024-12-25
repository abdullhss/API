import { StatusCodes } from "http-status-codes";
import reviewModel from "../../../../DB/model/Review.model.js";
import { ModifyError } from "../../../utils/classError.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import orderModel from "../../../../DB/model/Order.model.js";

export const getReviewsOfProduct = asyncHandler(async (req, res, next) => {
  const reviews = await reviewModel.find({ productId: req.params._id });
  // const modifiedReviwes = reviews.map((review) => ({
  //     ...review.toObject(),
  //     createdBy: review.createdBy.name,
  //     productId: review.createdBy.productId,
  // }));
  return res.json({ messgae: "Reviews Returned Successfully", reviews });
});

export const addReview = asyncHandler(async (req, res, next) => {
  const [order] = await orderModel
    .find({ createdBy: req.user._id })
    .sort("-createdAt")
    .limit(1)
    .populate({
      select: "products",
      path: "products.id",
      populate: { path: "createdBy", select: "_id" },
    });

  const rev = await reviewModel.findOne({
    orderId: order._id,
    createdBy: req.user._id,
  });
  if (rev) {
    return next(
      new ModifyError(
        `You already reviewed this order before`,
        StatusCodes.CONFLICT
      )
    );
  }

  const sellersId = [];
  for (const product of order.products) {
    const sellerId = product.id.createdBy._id;
    if (!sellersId.includes(sellerId)) {
      sellersId.push(sellerId);
      await reviewModel.create({
        rate: req.body.rating,
        review: req.body.review,
        createdBy: req.user._id,
        sellerId: sellerId,
        orderId: order._id,
      });
    }
  }

  // req.body.createdBy = req.user._id;
  // req.body.productId = req.product._id;
  // req.product.noRating++;
  // req.product.totalRating += req.body.rate;
  // await req.product.save();

  return res.json({ message: "success" });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  if (req.body.rate) {
    req.product.totalRating -= req.review.rate;
    req.product.totalRating += req.body.rate;
    await req.product.save();
  }

  const rev = await req.review.updateOne(req.body);
  return res.json({ messgae: "Reviews Updated Successfully", rev });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  req.product.noRating--;
  req.product.totalRating -= req.review.rate;
  await req.product.save();
  await req.review.deleteOne();

  return res.json({ messgae: "Reviews Deleted Successfully" });
});

export const getReviews = async (req, res) => {
  return res.json({
    message: "success",
    data: await reviewModel
      .find({ sellerId: req.user._id })
      .populate("createdBy", "name"),
  });
};
