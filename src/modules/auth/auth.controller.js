import bcryptjs from "bcryptjs";
import userModel from "../../../DB/model/User.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/errorHandling.js";
import { userStatus } from "../../utils/systemConstants.js";
import { ModifyError } from "../../utils/classError.js";
import { StatusCodes } from "http-status-codes";
import cartModel from "../../../DB/model/Cart.model.js";

export const signup = asyncHandler(async (req, res, next) => {
  // Check if email is already exist
  const isEmail = await userModel.findOne({ email: req.body.email });
  if (isEmail)
    return next(
      new ModifyError("Email is already exist", StatusCodes.CONFLICT)
    );

  // hashing user password
  req.body.password = bcryptjs.hashSync(
    req.body.password,
    +process.env.SALT_ROUND // 9
  );

  // Add user info to DB
  const user = await userModel.create(req.body);

  // Generate cart for user
  await cartModel.create({ userId: user._id });

  // return response with user info
  return res.status(200).json({ message: "success", user });
});

export const login = asyncHandler(async (req, res, next) => {
  // constract data from body
  const { email, password } = req.body;

  // check if user is exist
  const isEmail = await userModel.findOne({ email });
  if (!isEmail)
    return next(new ModifyError("invalid info", StatusCodes.BAD_REQUEST));

  // check if the password matching with hashed password in DB
  if (!bcryptjs.compareSync(password, isEmail.password))
    return next(new ModifyError("invalid info", StatusCodes.BAD_REQUEST));

  // generate token to the login user
  const token = jwt.sign(
    { id: isEmail._id, name: isEmail.name, email: isEmail.email },
    process.env.TOKEN_SIGNATURE
  );

  isEmail.status = userStatus.Online; // Change status of user to online
  await isEmail.save(); // apply changes into DB

  // return response with token
  return res.status(200).json({ message: "success", token, user: isEmail });
});
