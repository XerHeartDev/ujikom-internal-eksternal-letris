import cron from "node-cron";
import * as Rental from "../models/rentalModel.js";
import * as Book from "../models/bookModel.js";

cron.schedule("* * * * *", async () => {
  try {
    console.log("⏰ Rental cron running");

    const [result] = await Rental.finishExpiredRentals();

    if (result.affectedRows > 0) {
      await Book.resetExpiredBooks();
      console.log(`✅ ${result.affectedRows} rental finished`);
    }
  } catch (error) {
    console.error("❌ Cron error:", error.message);
  }
});
