import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/errorHandling.js";
import { ModifyError } from "../utils/classError.js";
import { reqDataForms, uniqueFields } from "../utils/systemConstants.js";

export const isExist = ({
  model,
  searchData = uniqueFields.id,
  dataFrom = reqDataForms.parmas,
  isId = true,
}) => {
  return asyncHandler(async (req, res, next) => {
    // construct model name from model
    const modelName = model.modelName.toLowerCase();

    let isModelExist;

    if (searchData == uniqueFields.couponCode && !req[dataFrom][searchData]) {
      return next();
    }

    if (req[dataFrom][searchData]) {
      // check the id exist ?

      if (isId) {
        isModelExist = await model.findById(req[dataFrom][searchData]);
      } else {
        const inputData = {};
        inputData[searchData] = req[dataFrom][searchData];
        isModelExist = await model.findOne(inputData);
      }

      if (!isModelExist)
        return next(
          new ModifyError(
            `${modelName} ${searchData} doesn't exist`,
            StatusCodes.NOT_FOUND
          )
        );
    } else {
      return next(
        new Error(`${searchData} not given`, StatusCodes.BAD_REQUEST)
      );
    }
    // add model data to the request object to use it throw other middlewares
    req[modelName] = isModelExist;
    next();
  });
};
