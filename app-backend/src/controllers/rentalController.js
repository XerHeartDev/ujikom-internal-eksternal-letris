import * as Book from "../models/bookModel.js";
import * as Rental from "../models/rentalModel.js";

export const getAllRentals = async (req, res) => {
  try {
    // Query Execution
    const rentals = await Rental.getAll();

    // Success Response
    res.status(200).json({
      message: "Successfully retrieved all rentals",
      rentalsData: rentals,
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error retrieving rentals",
    });
  }
};

export const getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.getByUserId(req.user.id);

    res.status(200).json({
      message: "Successfully retrieved user rentals",
      rentalsData: rentals,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving rentals",
    });
  }
};

export const createRental = async (req, res) => {
  try {
    // Initialization
    const userId = req.user.id;
    const { book_id, duration } = req.body;

    // Field Validation
    if (!book_id || !duration) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }
    // Duration Validation
    if (!Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({
        message: "Invalid rental duration",
      });
    }

    // Check If Book Exists and is Available
    const book = await Book.getById(book_id);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    if (book.status !== "available") {
      return res.status(400).json({
        message: "Book is not available",
      });
    }

    // Check If User Has Active Rental for the Same Book
    const activeRental = await Rental.getActiveByBookId(book_id);
    if (activeRental) {
      return res.status(400).json({
        message: "Book already rented",
      });
    }

    // Query Execution
    await Rental.create({
      user_id: userId,
      book_id,
      duration,
    });

    // Update Book Status
    await Book.setUnavailable(book_id);

    // Success Response
    res.status(201).json({
      message: "Book rented successfully",
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error creating rental",
    });
  }
};
