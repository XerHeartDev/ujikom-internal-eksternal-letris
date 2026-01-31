import db from "../config/db.js";

export const syncRentalStatus = async () => {
  const [expired] = await db.query(`
        SELECT
            id, book_id
        FROM
            rentals
        WHERE
            status = 'active' AND
            due_at <= NOW()
    `);

  for (const r of expired) {
    await db.query(
      `
        UPDATE 
            rentals
        SET
            status = 'finished'
        WHERE
            id = ?
      `,
      [r.id],
    );

    await db.query(
      `
        UPDATE
            books
        SET
            status = 'available'
        WHERE
            id = ?
      `,
      [r.book_id],
    );
  }
};
