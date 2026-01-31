import * as Payment from "../models/paymentModel.js";
import * as Rental from "../models/rentalModel.js";
import * as Book from "../models/bookModel.js";

export const midtransCallback = async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;

    const payment = await Payment.findByOrderId(order_id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "success") {
      return res.status(200).json({ received: true });
    }

    if (transaction_status === "settlement") {
      await Payment.updateStatus(order_id, "success");

      await Rental.create({
        user_id: payment.user_id,
        book_id: payment.book_id,
        duration: payment.duration,
      });

      await Book.setUnavailable(payment.book_id);
    }

    if (transaction_status === "cancel" || transaction_status === "expire") {
      await Payment.updateStatus(order_id, "failed");
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Midtrans callback error:", err);
    res.status(500).end();
  }
};
