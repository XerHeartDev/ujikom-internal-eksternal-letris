import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import { checkAdminOrUserOwnership } from "../middlewares/ownership.js";

const userRouter = express.Router();

// Routes
userRouter.get("/", requireRole(["admin"]), getAllUsers);
userRouter.get(
  "/:id",
  auth,
  requireRole(["admin", "user"]),
  checkAdminOrUserOwnership,
  getUserById,
);
userRouter.post("/register", createUser);
userRouter.post("/", auth, requireRole(["admin"]), createUser);
userRouter.put(
  "/:id",
  auth,
  requireRole(["admin", "user"]),
  checkAdminOrUserOwnership,
  updateUser,
);
userRouter.put(
  "/:id/password",
  auth,
  checkAdminOrUserOwnership,
  updateUserPassword,
);
userRouter.delete(
  "/:id",
  auth,
  requireRole(["admin", "user"]),
  checkAdminOrUserOwnership,
  deleteUser,
);

export default userRouter;
