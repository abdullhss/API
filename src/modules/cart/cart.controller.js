import cartModel from "../../../DB/model/Cart.model.js";
import productModel from "../../../DB/model/Product.model.js";
import { ModifyError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";

/*
two conditions:
1- product is in cart already
2- product isn't in cart
*/

export const add = asyncHandler(async (req, res, next) => {
  // check if the product is already exist in the cart

  console.log(req.product);
  console.log("req.product");

  req.body.productExist
    ? // update quantity of the exist product in the cart
      await cartModel.updateOne(
        {
          _id: req.cart._id,
          "products.id": req.product._id,
        },
        {
          "products.$.quantity": req.body.quantity || 1,
        }
      )
    : // add the product info to the user cart
      await req.cart.updateOne({
        $push: {
          products: { id: req.product._id, quantity: req.body.quantity || 1 },
        },
      });

  return res.status(200).json({
    status: "success",
    message: "Product added to cart",
    numOfCartItems: req.cart.products.length,
  });
});

export const update = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    {
      _id: req.cart._id,
      "products.id": req.product._id,
    },
    {
      "products.$.quantity": req.body.quantity,
    },
    {
      new: true,
    }
  );

  let totalCartPrice = 0;
  // for (const product of cart.products) {
  //   totalCartPrice += (product.quantity || 1) * product.id.price;
  // }
  const products = [];

  for (const ele of cart.products) {
    const product = await productModel.findById(ele.id._id);
    // console.log(product);

    totalCartPrice += (ele.quantity || 1) * product.price;
    const images = product.images.map((ele) => {
      return ele.secure_url;
    });

    products.push({
      product: {
        ...product._doc,
        title: product._doc.name,
        imageCover: product._doc.imageCover.secure_url,
        images,
        ratingsQuantity: product._doc.noRating,
        ratingsAverage: product._doc.totalRating / (product._doc.noRating || 1),
      },

      price: (ele.quantity || 1) * product.price,
      count: ele.quantity || 1,
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      products,
      totalCartPrice,
      _id: req.user._id,
    },
    numOfCartItems: cart.products.length,
  });

  /*
      data: {
      products,
      totalCartPrice,
      _id: req.user._id,
    },
    numOfCartItems: cart.products.length,
  */
});

export const remove = asyncHandler(async (req, res, next) => {
  // check if the product is exist in cart or not
  if (!req.body.productExist)
    return next(new ModifyError("product not found", StatusCodes.BAD_REQUEST));

  // remove the product from cart that match product.id = cart.products.id
  const cart = await cartModel.findByIdAndUpdate(
    req.cart._id,
    {
      $pull: { products: { id: req.product._id } },
    },
    {
      new: true,
    }
  );
  let totalCartPrice = 0;
  // for (const product of cart.products) {
  //   totalCartPrice += (product.quantity || 1) * product.id.price;
  // }
  const products = [];

  for (const ele of cart.products) {
    // console.log(ele);

    const product = await productModel.findById(ele.id._id);
    // console.log(product);

    totalCartPrice += (ele.quantity || 1) * product.price;
    const images = product.images.map((ele) => {
      return ele.secure_url;
    });

    products.push({
      product: {
        ...product._doc,
        title: product._doc.name,
        imageCover: product._doc.imageCover.secure_url,
        images,
        ratingsQuantity: product._doc.noRating,
        ratingsAverage: product._doc.totalRating / (product._doc.noRating || 1),
      },

      price: (ele.quantity || 1) * product.price,
      count: ele.quantity || 1,
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      products,
      totalCartPrice,
      _id: req.user._id,
    },
    numOfCartItems: cart.products.length,
  });
});

export const clear = asyncHandler(async (req, res, next) => {
  // remove the product from cart that match product.id = cart.products.id
  const cart = await cartModel.findByIdAndUpdate(
    req.cart._id,
    {
      products: [],
    },
    {
      new: true,
    }
  );

  return res.status(200).json({ message: "success" });
});

export const get = async (req, res, next) => {
  // console.log(req.cart);
  const cart = req.cart;

  const news = await cartModel
    .findByIdAndUpdate(
      { _id: req.cart._id },

      { $pull: { products: { id: null } } },
      { new: true }
    )
    .populate("products.id");

  let totalCartPrice = 0;

  const products = cart.products
    .map((ele) => {
      if (!ele.id) {
        return false;
      }
      totalCartPrice += (ele.quantity || 1) * ele.id.price;
      const images = ele.id._doc.images.map((ele) => {
        return ele.secure_url;
      });
      return {
        product: {
          ...ele.id._doc,
          title: ele.id._doc.name,
          imageCover: ele.id._doc.imageCover.secure_url,
          images,
          ratingsQuantity: ele.id._doc.noRating,
          ratingsAverage: ele.id._doc.totalRating / (ele.id._doc.noRating || 1),
        },

        price: (ele.quantity || 1) * ele.id.price,
        count: ele.quantity || 1,
      };
    })
    .filter((ele) => ele);
  // const products = cart.products
  //   .map((ele) => {
  //     if (!ele.id) {
  //       return false;
  //     }
  //     totalCartPrice += (ele.quantity || 1) * ele.id.price;
  //     const images = ele.id._doc.images.map((ele) => {
  //       return ele.secure_url;
  //     });
  //     return {
  //       product: {
  //         ...ele.id._doc,
  //         title: ele.id._doc.name,
  //         imageCover: ele.id._doc.imageCover.secure_url,
  //         images,
  //         ratingsQuantity: ele.id._doc.noRating,
  //         ratingsAverage: ele.id._doc.totalRating / (ele.id._doc.noRating || 1),
  //       },

  //       price: (ele.quantity || 1) * ele.id.price,
  //       count: ele.quantity || 1,
  //     };
  //   })
  //   .filter((ele) => ele);

  return res.status(200).json({
    status: "success",
    data: {
      products,
      totalCartPrice,
      _id: req.user._id,
    },
    numOfCartItems: cart.products.length,
  });
};
