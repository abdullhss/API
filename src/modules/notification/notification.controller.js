import { Router } from "express";
import auth from "../../middleware/auth.js";
import { getAllNotification, markAsRead } from "./notification.router.js";

const notificationRouter = Router();

notificationRouter.get("/", auth(), getAllNotification);
notificationRouter.patch("/:id", auth(), markAsRead);

export default notificationRouter;
