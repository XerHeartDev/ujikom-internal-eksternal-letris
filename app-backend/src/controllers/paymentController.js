import { snap } from "../services/midtrans.js";
import * as Payment from "../models/paymentModel.js";

export const createPayment = async (req, res) => {
  const { book_id, duration } = req.body;
  const user = req.user;

  const pricePerDay = 3000;
  const amount = duration * pricePerDay;

  const orderId = `ORDER-${Date.now()}-${user.id}`;

  const transaction = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
  };

  const snapResponse = await snap.createTransaction(transaction);

  await Payment.create({
    order_id: orderId,
    user_id: user.id,
    book_id,
    amount,
    duration,
  });

  res.json({
    snapToken: snapResponse.token,
  });
};
