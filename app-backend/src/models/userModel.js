import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const getAll = async () => {
  const [rows] = await db.query(`
        SELECT
            id,
            name,
            email,
            role
        FROM
            users
        ORDER BY
            role ASC
    `);

  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    `
      SELECT
          id,
          name,
          email,
          role
      FROM
          users
      WHERE
          id = ?
    `,
    [id],
  );

  return rows.length ? rows[0] : null;
};

export const getUserWithPassword = async (id) => {
  const [rows] = await db.query(
    `
      SELECT 
        id, 
        password
      FROM 
        users
      WHERE 
        id = ?
    `,
    [id],
  );

  return rows.length ? rows[0] : null;
};

export const create = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return db.query(
    `
        INSERT INTO
            users
                (name, email, password, role)
            VALUES
                (?, ?, ?, ?)
    `,
    [data.name, data.email, hashedPassword, data.role || "user"],
  );
};

export const update = async (id, data) => {
  return db.query(
    `
        UPDATE
            users
        SET
            name = ?,
            email = ?
        WHERE
            id = ?
    `,
    [data.name, data.email, id],
  );
};

export const updatePassword = async (id, hashedPassword) => {
  return db.query(
    `
      UPDATE 
        users
      SET 
        password = ?
      WHERE 
        id = ?
    `,
    [hashedPassword, id],
  );
};

export const remove = async (id) => {
  const [results] = db.query(
    `
      DELETE FROM
          users
      WHERE
          id = ?
    `,
    [id],
  );

  return rows.length ? rows[0] : null;
};
