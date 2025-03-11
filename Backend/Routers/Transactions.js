import express from "express";
import {
  addTransactionController,
  deleteTransactionController,
  getAllTransactionController,
  updateTransactionController,
  deleteMultipleTransactionsController,
} from "../controllers/transactionController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with authentication middleware
router.use(authenticateUser);

// Define routes
router.post("/addTransaction", addTransactionController);
router.post("/getTransaction", getAllTransactionController);
router.delete("/deleteTransaction/:id", deleteTransactionController);
router.put("/updateTransaction/:id", updateTransactionController);
router.delete("/deletemulTransactions", deleteMultipleTransactionsController);

export default router;