import { Schema, model } from "mongoose";
import { userRoles, userStatus } from "../../src/utils/systemConstants.js";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 20 char"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.User,
    },
    // confirmEmail: {
    //   type: Boolean,
    //   default: false,
    // },
    status: {
      type: String,
      enum: Object.values(userStatus),
      default: userStatus.Offline,
    },
    image: Object,
    DOB: String,
    code: String,
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    socketId: String,
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);
export default userModel;
