import { Router } from "express";
import {
  getUsers,
  getUserbyId,
  putUser,
  deleteUser,
} from "../controllers/users.controllers.js";

import { authorization, passportError } from "../utils/messageError.js";

const userRouter = Router();

userRouter.get("/", passportError("jwt"), authorization("admin"), getUsers);

userRouter.get(
  "/:id",
  passportError("jwt"),
  authorization("admin"),
  getUserbyId
);

userRouter.put("/:id", passportError("jwt"), authorization("admin"), putUser);

userRouter.delete(
  "/:id",
  passportError("jwt"),
  authorization("admin"),
  deleteUser
);

export default userRouter;
