import Router from "express";
import { resetPasswordPost } from "../controllers/resetPassword.controller.js";

const resetPasswordRouter = Router();

resetPasswordRouter.post("/", resetPasswordPost);

export default resetPasswordRouter;
