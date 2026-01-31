import bcrypt from "bcrypt";
import * as User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    // Query Execution
    const results = await User.getAll();

    // Success Response
    res.status(200).json({
      message: "Users retrieved successfully",
      usersData: results,
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error retrieving users",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    // Initialization
    const { id } = req.params;

    // Query Execution
    const results = await User.getById(id);

    if (!results) {
      // Not Found Response
      res.status(404).json({
        message: "User not found",
      });
    }

    // Success Response
    res.status(200).json({
      message: "User retrieved successfully",
      userData: results,
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error retrieving user",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    // Initialization
    const { name, email, password } = req.body;
    let role = "user";
    if (req.user && req.user.role === "admin") {
      role = req.body.role || "user";
    }

    // Field Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill the required fields",
      });
    }

    // Query Execution
    await User.create({ name, email, password, role });

    // Success Response
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error creating user",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Initialization
    const { id } = req.params;

    // Check if user exists
    const existingUser = await User.getById(id);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Admin Check
    const isAdmin = req.user.role === "admin";
    // Field Preparation
    const {
      name = existingUser.name,
      email = existingUser.email,
      role = isAdmin ? (req.body.role ?? existingUser.role) : existingUser.role,
    } = req.body;

    // Query Execution
    await User.update(id, { name, email, role });
    const updatedUser = await User.getById(id);

    // Success Response
    res.status(200).json({
      message: "User updated successfully",
      userData: updatedUser,
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error updating user",
    });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    // Initialization
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    // Field Validation
    if (!new_password) {
      return res.status(400).json({
        message: "New Password Empty",
      });
    }
    if (new_password.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    // Check If User Exists
    const user = await User.getUserWithPassword(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Password Validation for Non-Admins
    // Field Validation
    if (!old_password) {
      return res.status(400).json({
        message: "Old password is required",
      });
    }

    // Verify Old Password
    const match = await bcrypt.compare(old_password, user.password);
    if (!match) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    // Hash New Password and Update
    const hashedPassword = await bcrypt.hash(new_password, 10);
    // Query Execution
    await User.updatePassword(id, hashedPassword);

    // Success Response
    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error updating password",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Initialization
    const { id } = req.params;

    // Query Execution
    const results = await User.remove(id);

    if (results.affectedRows === 0) {
      // Not Found Response
      res.status(404).json({
        message: "User not found",
      });
    }

    // Success Response
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    // Error Response
    res.status(500).json({
      message: "Error deleting user",
    });
  }
};
