import jwt from "jsonwebtoken";
import userModel from "../../../DB/model/User.model.js";
import { ModifyError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";

export const getData = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ messaeg: "done", user: req.user });
});

export const update = asyncHandler(async (req, res, next) => {
  // check if new email is taken by another user
  const isNewEmail = await userModel.findOne({
    _id: { $ne: req.user._id },
    email: req.body.email,
  });
  if (isNewEmail)
    return next(
      new ModifyError("Email is already taken", StatusCodes.CONFLICT)
    );

  console.log(
    "======================================================================="
  );

  console.log(req.body.name, req.body.email);
  console.log(
    "======================================================================="
  );
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true }
  ); // update data into DB

  const token = jwt.sign(
    { email: req.body.email, name: user.name, id: user._id },
    process.env.TOKEN_SIGNATURE
  );

  return res.status(200).json({ message: "success", token, user });
});

export const remove = asyncHandler(async (req, res, next) => {
  await req.user.deleteOne();
  return res.status(200).json({ message: "success" });
});

export const getUserById = asyncHandler(async (id) => {
  return await userModel.findById(id);
});

export const addChat = asyncHandler(async (userId1, userId2) => {
  await userModel.updateOne(
    { _id: userId1 },
    { $addToSet: { chats: userId2 } }
  );
  await userModel.updateOne(
    { _id: userId2 },
    { $addToSet: { chats: userId1 } }
  );
});
