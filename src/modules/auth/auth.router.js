import { Router } from "express";
import * as userController from "./auth.controller.js";
import * as validator from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
const router = Router();

router.get("/", (req, res) => res.json({ mesasge: `${req.originalUrl} Page` }));

router.post("/signup", userController.signup);
router.post("/signin", userController.login);
export default router;
