import express from "express";
import { midtransCallback } from "../controllers/midtransCallbackController.js";

const midtransRouter = express.Router();

// Routes
midtransRouter.post("/callback", midtransCallback);

export default midtransRouter;
