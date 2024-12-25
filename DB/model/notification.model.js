import mongoose, * as mongo from "mongoose";

const notificationSchema = new mongo.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongo.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongo.model("Notification", notificationSchema);
export default notificationModel;
