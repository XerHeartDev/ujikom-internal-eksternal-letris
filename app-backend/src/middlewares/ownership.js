import * as Book from "../models/bookModel.js";
import { getActiveRental } from "../models/rentalModel.js";

export const checkAdminOrUserOwnership = (req, res, next) => {
  if (req.user.role === "admin" || req.user.id === Number(req.params.id)) {
    return next();
  }

  return res.status(403).json({
    message: "Forbidden",
  });
};

export const checkBookOwnership = async (req, res, next) => {
  // Initialization
  const userId = req.user.id;
  const bookId = req.params.id;

  // Validate bookId
  if (isNaN(bookId)) {
    return res.status(400).json({
      message: "Invalid book ID",
    });
  }

  // Check Book Existence
  const book = await Book.getById(bookId);
  if (!book) {
    return res.status(404).json({
      message: "Book file not found",
    });
  }

  // Active Rental Ownership Check
  const rental = await getActiveRental(userId, bookId);
  if (!rental) {
    return res.status(403).send({
      message: "You do not have an active rental for this book",
    });
  }

  next();
};
