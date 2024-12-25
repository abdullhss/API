import { Types } from "mongoose";
import notificationModel from "../../../DB/model/notification.model.js";
import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const getAllNotification = asyncHandler(async (req, res) => {
  return res.json({
    message: "success",
    data: await notificationModel
      .find({ userId: req.user._id })
      .sort("-createdAt"),
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  return res.json({
    message: "success",
    data: await notificationModel.findOneAndUpdate(
      { _id: req.params.id },
      { isRead: true },
      { new: true }
    ),
  });
});

export const sendUpdateNotification = async (productId, productName) => {
  const users = await userModel.aggregate([
    { $unwind: "$wishlist" },
    {
      $match: {
        $or: [
          { wishlist: new Types.ObjectId(productId) },
          { wishlist: new Types.ObjectId(productId).toString() },
        ],
      },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  users.forEach(async (user) => {
    await notificationModel.create({
      content: `the seller of the Product "${productName} that in your wishlist updated it`,
      userId: user._id,
    });
  });
};

export const sendDeleteNotification = async (product, productId) => {
  const users = await userModel.aggregate([
    { $unwind: "$wishlist" },
    {
      $match: {
        $or: [
          { wishlist: new Types.ObjectId(productId) },
          { wishlist: productId },
        ],
      },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  for (const user of users) {
    const notfi = await notificationModel.create({
      content: `The seller of the Product "${product.name} that in your wishlist deleted it"`,
      userId: user._id,
    });

    console.log("123");

    console.log({ notfi });

    await userModel.updateOne(
      { _id: user._id },
      {
        $pull: { wishlist: new Types.ObjectId(productId) },
      }
    );
  }
};

export const sendnewMessageNotification = async (loginUser, otherUser) => {
  await notificationModel.create({
    content: `You have recieved msg from "${loginUser.name}"`,
    userId: otherUser,
  });
};
