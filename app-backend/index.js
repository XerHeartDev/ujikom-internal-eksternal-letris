import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import indexRouter from "./src/router/indexRouter.js";
import authRouter from "./src/router/authRouter.js";
import userRouter from "./src/router/userRouter.js";
import bookRouter from "./src/router/bookRouter.js";
import rentalRouter from "./src/router/rentalRouter.js";
import paymentRouter from "./src/router/paymentRouter.js";
import midtransRouter from "./src/router/midtransRouter.js";

const app = express();

dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/midtrans", midtransRouter);

export default app;
