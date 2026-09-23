import { Request, Response } from "express";
import { TransactionsService } from "../services/transactions.service.js";
import { z } from "zod";

const createTransactionSchema = z.object({
  transaction_code: z.string().min(1).max(30).optional(),
  farmer_id: z.string().uuid("Invalid farmer ID"),
  inventory_item_id: z.string().uuid("Invalid inventory ID").optional(),
  type: z.string().min(1, "Type is required").max(30),
  description: z.string().optional(),
  quantity: z.number().min(0, "Quantity cannot be negative").optional(),
  unit_price: z.number().min(0, "Unit price cannot be negative").optional(),
  amount: z.number().positive("Amount must be greater than zero"),
  transaction_date: z.string().datetime().optional()
});

const updateTransactionSchema = z.object({
  type: z.string().min(1, "Type is required").max(30).optional(),
  description: z.string().optional(),
  quantity: z.number().min(0).optional(),
  unit_price: z.number().min(0).optional(),
  amount: z.number().positive().optional()
});

export const TransactionsController = {
  async getAll(req: Request, res: Response) {
    try {
      const txs = await TransactionsService.getAllTransactions();
      res.json({ success: true, data: txs });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ success: false, error: "Failed to fetch transactions" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const tx = await TransactionsService.getTransactionById(id);
      
      if (!tx) {
        return res.status(404).json({ success: false, error: "Transaction not found" });
      }
      
      res.json({ success: true, data: tx });
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ success: false, error: "Failed to fetch transaction" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parsedData = createTransactionSchema.parse(req.body);
      const tx = await TransactionsService.createTransaction({
        ...(parsedData as any),
        created_by: req.user?.id,
        transaction_date: parsedData.transaction_date ? new Date(parsedData.transaction_date) : undefined
      });
      res.status(201).json({ success: true, data: tx });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      if (error.code === 'P2002') {
        return res.status(409).json({ success: false, error: "Transaction code already exists" });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({ success: false, error: "Invalid farmer or inventory item reference" });
      }
      console.error("Error creating transaction:", error);
      res.status(500).json({ success: false, error: "Failed to create transaction" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const parsedData = updateTransactionSchema.parse(req.body);
      const tx = await TransactionsService.updateTransaction(id, parsedData);
      res.json({ success: true, data: tx });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      if (error.message === "Transaction not found" || error.code === 'P2025') {
        return res.status(404).json({ success: false, error: "Transaction not found" });
      }
      if (error.message === "New amount cannot be less than already paid amount") {
        return res.status(400).json({ success: false, error: error.message });
      }
      console.error("Error updating transaction:", error);
      res.status(500).json({ success: false, error: "Failed to update transaction" });
    }
  }
};
