import { Router } from "express";
import * as usercontroller from "./user.controller.js";
import * as userValidator from "./user.validation.js";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
const router = Router();

router.get("/", auth(), usercontroller.getData);
router.patch("/", auth(), usercontroller.update);
router.delete("/delete", auth(), usercontroller.remove);
export default router;
