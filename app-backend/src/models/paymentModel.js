// src/models/paymentModel.js
import db from "../config/db.js";

export const create = async ({
  order_id,
  user_id,
  book_id,
  amount,
  duration,
}) => {
  return db.query(
    `
      INSERT INTO 
        payments
            (order_id, user_id, book_id, amount, duration, status)
        VALUES
            (?, ?, ?, ?, ?, 'pending')
    `,
    [order_id, user_id, book_id, amount, duration],
  );
};

export const findByOrderId = async (orderId) => {
  const [rows] = await db.query(
    `
      SELECT 
        *
      FROM 
        payments
      WHERE 
        order_id = ?
      LIMIT 
        1
    `,
    [orderId],
  );

  return rows.length ? rows[0] : null;
};

export const updateStatus = async (orderId, status) => {
  return db.query(
    `
      UPDATE 
        payments
      SET 
        status = ?
      WHERE 
        order_id = ?
    `,
    [status, orderId],
  );
};
