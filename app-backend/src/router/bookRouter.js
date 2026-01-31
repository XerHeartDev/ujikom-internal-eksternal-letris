import express from "express";
import {
  getAllBooks,
  getBookById,
  getBookRead,
  createBook,
  updateBook,
  deleteBook,
  uploadBook,
  uploadBookCoverImage,
  getBookCover,
  deleteBookCover,
} from "../controllers/bookController.js";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import { checkBookOwnership } from "../middlewares/ownership.js";
import { uploadBookFile } from "../middlewares/uploadBookFile.js";
import { uploadBookCover } from "../middlewares/uploadBookCover.js";

const bookRouter = express.Router();

// Routes
/// GET
bookRouter.get("/", getAllBooks);
bookRouter.get("/:id", getBookById);
bookRouter.get("/:id/cover", getBookCover);
bookRouter.get("/:id/read", auth, checkBookOwnership, getBookRead);
/// POST
bookRouter.post("/", auth, requireRole(["admin"]), createBook);
bookRouter.post(
  "/:id/upload",
  auth,
  requireRole(["admin"]),
  uploadBookFile.single("file"),
  uploadBook,
);
bookRouter.post(
  "/:id/upload-cover",
  // auth,
  // requireRole(["admin"]),
  uploadBookCover.single("cover"),
  uploadBookCoverImage,
);
/// PUT
bookRouter.put("/:id", auth, requireRole(["admin"]), updateBook);
/// DELETE
bookRouter.delete("/:id", auth, requireRole(["admin"]), deleteBook);
bookRouter.delete("/:id/cover", auth, requireRole(["admin"]), deleteBookCover);

export default bookRouter;
