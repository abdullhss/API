import jwt from "jsonwebtoken";
import userModel from "../../../DB/model/User.model.js";
import { chatModel } from "../../../DB/model/chat.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { sendnewMessageNotification } from "../notification/notification.router.js";

export const setNewSocketId = async (id, newSocket) => {
  await userModel.updateOne({ _id: id }, { socketId: newSocket });
};

export const checkToken = async (token) => {
  try {
    const { id } = jwt.verify(token, process.env.TOKEN_SIGNATURE);

    const user = await userModel.findById(id).populate("chats");
    // console.log(user);

    return user ? user : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addMsg = async (user, data) => {
  const { to, message } = data;

  await chatModel.create({
    from: user._id,
    to,
    content: message,
  });

  await sendnewMessageNotification(user, to);
};

export const getAllMsgs = async (loginUserId, anotherUserId) => {
  return await chatModel.find({
    $or: [
      { to: loginUserId, from: anotherUserId },
      {
        to: anotherUserId,
        from: loginUserId,
      },
    ],
  });
  // .populate("to", "name")
  // .populate("from", "name");
};

export const addChat = asyncHandler(async (loginUser, otherUser) => {
  await userModel.updateOne();
});
