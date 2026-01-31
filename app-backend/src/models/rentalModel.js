import db from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query(
    `
      SELECT 
        r.*, 
        u.name, 
        b.title
      FROM 
        rentals r
      JOIN 
        users u ON r.user_id = u.id
      JOIN 
        books b ON r.book_id = b.id
      ORDER BY 
        r.rent_date DESC
    `,
  );
  return rows;
};

export const getByUserId = async (userId) => {
  const [rows] = await db.query(
    `
      SELECT 
        r.*, 
        b.title,
        b.cover_path
      FROM 
        rentals r
      JOIN 
        books b ON r.book_id = b.id
      WHERE 
        r.user_id = ? and
        r.status = 'active'
      ORDER BY 
        r.rent_date DESC
    `,
    [userId],
  );
  return rows;
};

export const getActiveRental = async (userId, bookId) => {
  const [rows] = await db.query(
    `
      SELECT 
        id
      FROM 
        rentals
      WHERE 
        user_id = ? AND 
        book_id = ? AND 
        status = 'active'
    `,
    [userId, bookId],
  );

  return rows.length ? rows[0] : null;
};

export const getActiveByBookId = async (bookId) => {
  const [rows] = await db.query(
    `
      SELECT 
        id
      FROM 
        rentals
      WHERE 
        book_id = ? AND 
        status = 'active'
    `,
    [bookId],
  );
  return rows.length ? rows[0] : null;
};

export const create = async ({ user_id, book_id, duration }) => {
  return db.query(
    `
      INSERT INTO 
        rentals 
            (user_id, book_id, rent_date, due_date)
        VALUES 
            (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))
    `,
    [user_id, book_id, duration],
  );
};

export const finishExpiredRentals = async () => {
  return db.query(`
      UPDATE 
        rentals
      SET 
        status = 'finished'
      WHERE 
        status = 'active' AND 
        due_date <= NOW()
    `);
};
