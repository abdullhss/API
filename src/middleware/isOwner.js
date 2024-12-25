import { StatusCodes } from "http-status-codes";
import { ModifyError } from "../utils/classError.js";
import { asyncHandler } from "../utils/errorHandling.js";

export const isOwner = (model) => {
  return asyncHandler(async (req, res, next) => {
    const modelName = model.modelName.toLowerCase();

    if (req[modelName].createdBy.toString() != req.user._id)
      return next(
        new ModifyError(
          `Your are not the owner for this ${modelName}`,
          StatusCodes.FORBIDDEN
        )
      );

    next();
  });
};
