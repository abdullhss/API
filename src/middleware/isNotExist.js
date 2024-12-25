import { StatusCodes } from "http-status-codes";
import { ModifyError } from "../utils/classError.js";
import { asyncHandler } from "../utils/errorHandling.js";

export const isNotExist = ({ model, searchData }) => {
  return asyncHandler(async (req, res, next) => {
    const inputDB = {};
    if (req.body[searchData]) {
      inputDB[searchData] = req.body[searchData];
      let isExist;
      if (req.method != "PUT") isExist = await model.findOne(inputDB);
      else
        isExist = await model.findOne({
          _id: { $ne: req[model.modelName.toLowerCase()]._id },
          ...inputDB,
        });
      if (isExist) {
        return next(
          new ModifyError(
            `${searchData} is already exist`,
            StatusCodes.CONFLICT
          )
        );
      }
    }
    next();
  });
};
