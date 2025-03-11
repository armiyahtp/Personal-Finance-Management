import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

export const addTransactionController = async (req, res) => {
  try {
    const { title, amount, description, date, category, transactionType } = req.body;
    const userId = req.user.id;

    if (!title || !amount || !description || !date || !category || !transactionType) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newTransaction = await Transaction.create({
      title,
      amount,
      category,
      description,
      date,
      user: userId,
      transactionType: transactionType.toLowerCase(),
    });

    user.transactions.push(newTransaction._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (err) {
    console.error("Add Transaction Error:", err);
    res.status(500).json({ success: false, message: "Server error adding transaction" });
  }
};

export const getAllTransactionController = async (req, res) => {
  try {
    const { type, frequency, startDate, endDate } = req.body;
    const userId = req.user.id;

    const query = { user: userId };
    if (type && type !== "all") {
      query.transactionType = type.toLowerCase();
    }

    if (frequency && frequency !== "all") {
      if (frequency === "custom" && startDate && endDate) {
        query.date = {
          $gte: moment(startDate).startOf("day").toDate(),
          $lte: moment(endDate).endOf("day").toDate(),
        };
      } else {
        query.date = { $gte: moment().subtract(Number(frequency), "days").toDate() };
      }
    }

    const transactions = await Transaction.find(query);

    res.status(200).json({ success: true, transactions });
  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(500).json({ success: false, message: "Server error fetching transactions" });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const transaction = await Transaction.findOneAndDelete({ _id: transactionId, user: userId });
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found or unauthorized" });
    }

    user.transactions = user.transactions.filter((id) => id.toString() !== transactionId);
    await user.save();

    res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Delete Transaction Error:", err);
    res.status(500).json({ success: false, message: "Server error deleting transaction" });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { title, amount, description, date, category, transactionType } = req.body;
    const userId = req.user.id;

    if (!title || !amount || !description || !date || !category || !transactionType) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: userId },
      { title, amount, description, date, category, transactionType: transactionType.toLowerCase() },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ success: false, message: "Transaction not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (err) {
    console.error("Update Transaction Error:", err);
    res.status(500).json({ success: false, message: "Server error updating transaction" });
  }
};

export const deleteMultipleTransactionsController = async (req, res) => {
  try {
    const { transactionIds } = req.body;
    const userId = req.user.id;

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({ success: false, message: "Valid transaction IDs array required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const result = await Transaction.deleteMany({ _id: { $in: transactionIds }, user: userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "No transactions found or unauthorized" });
    }

    user.transactions = user.transactions.filter((id) => !transactionIds.includes(id.toString()));
    await user.save();

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} transactions deleted successfully`,
    });
  } catch (err) {
    console.error("Multi-Delete Error:", err);
    res.status(500).json({ success: false, message: "Server error deleting transactions" });
  }
};