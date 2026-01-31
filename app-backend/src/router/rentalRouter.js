import express from "express";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import {
  createRental,
  getAllRentals,
  getUserRentals,
} from "../controllers/rentalController.js";

const rentalRouter = express.Router();

// Routes
rentalRouter.get("/", auth, requireRole(["admin"]), getAllRentals);
rentalRouter.get("/my-library", auth, getUserRentals);
rentalRouter.post("/", auth, createRental);

export default rentalRouter;
