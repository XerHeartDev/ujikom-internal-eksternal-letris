import fs from "fs";
import path from "path";
import * as Book from "../models/bookModel.js";
import { checkBookOwnership } from "../middlewares/ownership.js";

export const getAllBooks = async (req, res) => {
  try {
    // Query Execution
    const results = await Book.getAll();

    // Success Response
    res.status(200).json({
      message: "Books retrieved successfully",
      booksData: results,
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error retrieving books",
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    // Initialization
    const { id } = req.params;

    // Query Execution
    const results = await Book.getById(id);

    if (!results) {
      // Not Found Response
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Success Response
    res.status(200).json({
      message: "Book retrieved successfully",
      bookData: results,
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error retrieving book",
    });
  }
};

export const getBookCover = async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);

    if (!book || !book.cover_path) {
      return res.status(404).json({ message: "Cover not found" });
    }

    res.sendFile(path.resolve(book.cover_path));
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving cover",
    });
  }
};

export const getBookRead = async (req, res) => {
  try {
    // Initialization
    const bookId = req.params.id;

    // Check File Path In DB
    const book = await Book.getById(bookId);
    if (!book.file_path) {
      return res.status(404).json({
        message: "Book file not uploaded yet",
      });
    }

    // Check File Existence
    const filePath = path.resolve(book.file_path);
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        message: "Book file is missing on server",
      });
    }

    // Stream File
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error reading book",
    });
  }
};

export const createBook = async (req, res) => {
  try {
    // Initialization
    const {
      title,
      author,
      publisher,
      isbn,
      total_pages,
      publish_year,
      digitized_year,
    } = req.body;

    // Field Validation
    if (
      !title ||
      !author ||
      !publisher ||
      !isbn ||
      !total_pages ||
      !publish_year ||
      !digitized_year
    ) {
      return res.status(400).json({
        message: "Please fill the required fields",
      });
    }

    // Query Execution
    await Book.create({
      title,
      author,
      publisher,
      isbn,
      total_pages,
      publish_year,
      digitized_year,
    });

    // Success Response
    res.status(201).json({
      message: "Book created successfully",
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error creating book",
    });
  }
};

export const uploadBook = async (req, res) => {
  try {
    // Initialization
    const bookId = req.params.id;

    // File Validation
    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const filePath = req.file.path;

    // Query Execution
    await Book.updateFilePath(bookId, filePath);

    // Success Response
    res.status(200).json({
      message: "Book file uploaded successfully",
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error uploading book file",
    });
  }
};

export const uploadBookCoverImage = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "Cover file is required" });
    }

    const book = await Book.getById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.cover_path && fs.existsSync(book.cover_path)) {
      fs.unlinkSync(book.cover_path);
    }

    await Book.updateCoverPath(bookId, req.file.path);

    res.status(200).json({
      message: "Book cover uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading book cover",
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    // Initialization
    const { id } = req.params;

    // Check if book exists
    const existingBook = await Book.getById(id);
    if (!existingBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Field Preparation
    const {
      title = existingBook.title,
      author = existingBook.author,
      publisher = existingBook.publisher,
      isbn = existingBook.isbn,
      total_pages = existingBook.total_pages,
      publish_year = existingBook.publish_year,
      digitized_year = existingBook.digitized_year,
      cover_path = existingBook.cover_path,
    } = req.body;

    // Query Execution
    await Book.update(id, {
      title,
      author,
      publisher,
      isbn,
      total_pages,
      publish_year,
      digitized_year,
      cover_path,
    });

    // Success Response
    res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error updating book",
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    // Initialization
    const { id } = req.params;

    // Check if book exists
    const book = await Book.getById(id);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Remove Associated File
    if (book.file_path && fs.existsSync(book.file_path)) {
      fs.unlinkSync(book.file_path);
    }

    // Query Execution
    await Book.remove(id);

    // Success Response
    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error deleting book",
    });
  }
};

export const deleteBookCover = async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.getById(bookId);
    if (!book || !book.cover_path) {
      return res.status(404).json({
        message: "Cover not found",
      });
    }

    if (fs.existsSync(book.cover_path)) {
      fs.unlinkSync(book.cover_path);
    }

    await Book.updateCoverPath(bookId, null);

    res.status(200).json({
      message: "Book cover deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting book cover",
    });
  }
};
