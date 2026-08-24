import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const login = async (req, res) => {
  // Initialization
  const { email, password } = req.body;

  //   Validate user existence
  const [[user]] = await db.query(
    `
        SELECT 
            *
        FROM
            users
        WHERE
            email = ?
    `,
    [email],
  );
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  //   Validate password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  //   Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
