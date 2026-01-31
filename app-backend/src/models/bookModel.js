import db from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query(`
    SELECT
      id,
      status,
      title,
      author,
      publisher,
      isbn,
      total_pages,
      publish_year,
      digitized_year,
      cover_path
    FROM
        books
  `);

  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    `
      SELECT
        id,
        title,
        status,
        author,
        publisher,
        isbn,
        total_pages,
        publish_year,
        digitized_year,
        cover_path
      FROM 
        books
      WHERE 
        id = ?
    `,
    [id],
  );

  return rows.length ? rows[0] : null;
};

export const create = async (data) => {
  return db.query(
    `
      INSERT INTO 
        books
            (title, author, publisher, isbn, total_pages, publish_year, digitized_year)
        VALUES
            (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.title,
      data.author,
      data.publisher,
      data.isbn,
      data.total_pages,
      data.publish_year,
      data.digitized_year,
    ],
  );
};

export const update = async (id, data) => {
  return db.query(
    `
      UPDATE 
        books
      SET
        title = ?,
        author = ?,
        publisher = ?,
        isbn = ?,
        total_pages = ?,
        publish_year = ?,
        digitized_year = ?,
        cover_path = ?
      WHERE 
        id = ?
    `,
    [
      data.title,
      data.author,
      data.publisher,
      data.isbn,
      data.total_pages,
      data.publish_year,
      data.digitized_year,
      data.cover_path,
      id,
    ],
  );
};

export const updateFilePath = async (id, filePath) => {
  return db.query(
    `
      UPDATE
        books
      SET
        file_path = ?
      WHERE
        id = ?
    `,
    [filePath, id],
  );
};

export const updateCoverPath = async (id, coverPath) => {
  return db.query(
    `
      UPDATE
        books
      SET
        cover_path = ?
      WHERE
        id = ?
    `,
    [coverPath, id],
  );
};

export const setUnavailable = async (id) => {
  return db.query(
    `
    UPDATE 
      books
    SET 
      status = 'unavailable'
    WHERE 
      id = ?
  `,
    [id],
  );
};

export const remove = async (id) => {
  const [result] = await db.query(
    `
      DELETE FROM 
        books 
      WHERE 
        id = ?
    `,
    [id],
  );

  return result;
};

export const resetExpiredBooks = async () => {
  return db.query(`
    UPDATE 
      books b
    JOIN 
      rentals r ON r.book_id = b.id
    SET 
      b.status = 'available'
    WHERE 
      r.status = 'finished' AND 
      b.status = 'unavailable'
  `);
};
