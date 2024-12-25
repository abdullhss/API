import categoryModel from "../../../DB/model/Category.model.js";
import userModel from "../../../DB/model/User.model.js";
import { StatusCodes } from "http-status-codes";
import { ModifyError } from "../../utils/classError.js";

export const validateUser = async (req) => {
    const user = await userModel.findOne({ name: req.body.createdBy });
    if (!user) {
        return new ModifyError(`${req.body.createdBy} doesn't exist`, StatusCodes.NOT_FOUND);
    }
    return user._id;
}

export const validateCategory = async (req) => {
    const cat = await categoryModel.findOne({ name: req.body.category });
    if (!cat) {
        return new ModifyError(`${req.body.category} doesn't exist`, StatusCodes.NOT_FOUND);
    }
    return cat._id;
}

export const validateNumber = async (attributeName, number) => {
    if (number < 0) {
        return new ModifyError(`${attributeName} must be >= 0`, StatusCodes.NOT_ACCEPTABLE);
    }
    return number;
}

