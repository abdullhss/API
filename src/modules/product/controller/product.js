import { StatusCodes } from "http-status-codes";
import productModel from "../../../../DB/model/Product.model.js";
import { ModifyError } from "../../../utils/classError.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import * as validation from "../product.middleware.js";
import {
  sendDeleteNotification,
  sendUpdateNotification,
} from "../../notification/notification.router.js";

export const addProduct = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  req.body.stock = await validation.validateNumber("quantity", req.body.stock);
  req.body.price = await validation.validateNumber("price", req.body.price);
  req.product = await productModel.create(req.body);

  console.log(req.files);

  return next();
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findOneAndUpdate(
    { _id: req.product._id },
    {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      stock: req.body.stock,
      price: req.body.price,
    },
    {
      new: true,
    }
  );

  sendUpdateNotification(req.product._id, product.name);

  return res.status(200).json({
    message: "success",
    data: product,
  });
});

export const removeProduct = asyncHandler(async (req, res, next) => {
  await req.product.deleteOne();

  await sendDeleteNotification(req.product, req.params._id);

  return res.status(200).json({ message: "success" });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel
    .findById(req.params._id)
    .populate("subcategoryId")
    .populate("createdBy");

  const images = product._doc.images.map((ele) => {
    return ele.secure_url;
  });
  const data = {
    ...product._doc,
    title: product._doc.name,
    imageCover: product._doc.imageCover.secure_url,
    images,
    ratingsQuantity: product._doc.noRating,
    ratingsAverage: product._doc.totalRating / (product._doc.noRating || 1),
  };

  return res.status(200).json({
    message: "success",
    data,
  });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  // const products = await productModel
  //   .find()
  //   .populate("subcategoryId")
  //   .populate("createdBy");
  // const apiFeatures = new ApiFeatures(
  //   productModel.find(),
  //   req.query
  // ).pagination();
  const product = await productModel
    .find({ createdBy: { $ne: req.user._id } })
    .populate("category");

  const products = product.map((ele) => {
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

  // console.log(products);

  // if (!req.query.noDoc)
  //   return next(new ModifyError("No data matched", StatusCodes.NOT_FOUND));

  // const noPage = countPage(req);

  return res.status(200).json({
    message: "success",
    data: products,
    results: products.length,
    // NoPage: noPage,
    currentPage: req.query.page,
    limit: products.length,
  });
});

export const getUserProducts = asyncHandler(async (req, res, next) => {
  const products = await productModel
    .find({ createdBy: req.user._id })
    .populate("category");
  return products.length
    ? res.status(200).json({ message: "success", products })
    : next(new ModifyError("no products found", StatusCodes.NOT_FOUND));
});
