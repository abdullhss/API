import { StatusCodes } from "http-status-codes";
import brandModel from "../../DB/model/Brand.model.js";
import categoryModel from "../../DB/model/Category.model.js";
import productModel from "../../DB/model/Product.model.js";
import subcategoryModel from "../../DB/model/Subcategory.model.js";
import userModel from "../../DB/model/User.model.js";
import { ModifyError } from "../utils/classError.js";
import { asyncHandler } from "../utils/errorHandling.js";

const getAllData = (populateData = "") => {
  return asyncHandler(async (req, res, next) => {
    const model = getModelFromUrl(req.originalUrl);

    let data;

    if (populateData) data = await model.find().populate(populateData);
    else data = await model.find();

    const resObj = {};
    resObj.message = "success";

    // resObj[model.modelName] = data;
    resObj["data"] = data;

    return data.length
      ? res.status(StatusCodes.OK).json(resObj)
      : next(
          new ModifyError(`No ${model.modelName} found`, StatusCodes.NOT_FOUND)
        );
  });
};

export const getDataById = asyncHandler(async (req, res, next) => {
  const model = getModelFromUrl(req.originalUrl);
  const data = await model.findById(req.params._id);
  const resObj = {};
  resObj.message = "success";
  resObj["data"] = data;
  return data
    ? res.json(resObj)
    : next(new ModifyError(`No ${"data"} found`, StatusCodes.NOT_FOUND));
});

export const getModelFromUrl = (url) => {
  if (url.includes("user")) return userModel;
  if (url.includes("brand")) return brandModel;
  if (url.includes("subcategories")) return subcategoryModel;
  if (url.includes("categories")) return categoryModel;
  if (url.includes("products")) return productModel;
};
export default getAllData;
