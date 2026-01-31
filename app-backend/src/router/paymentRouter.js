import express from "express";
import { createPayment } from "../controllers/paymentController.js";
import { auth } from "../middlewares/auth.js";

const paymentRouter = express.Router();

// Routes
paymentRouter.post("/", auth, createPayment);

export default paymentRouter;
