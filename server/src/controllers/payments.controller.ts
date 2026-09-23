import { Request, Response } from "express";
import { PaymentsService } from "../services/payments.service.js";
import { z } from "zod";

const createPaymentSchema = z.object({
  payment_code: z.string().min(1).max(30).optional(),
  farmer_id: z.string().uuid("Invalid farmer ID"),
  transaction_id: z.string().uuid("Invalid transaction ID"),
  amount: z.number().positive("Amount must be greater than zero"),
  payment_method: z.literal("CASH"),
  reference_number: z.string().max(100).optional(),
  notes: z.string().optional(),
  payment_date: z.string().datetime().optional()
});

export const PaymentsController = {
  async getAll(req: Request, res: Response) {
    try {
      const payments = await PaymentsService.getAllPayments();
      res.json({ success: true, data: payments });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ success: false, error: "Failed to fetch payments" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const payment = await PaymentsService.getPaymentById(id);
      
      if (!payment) {
        return res.status(404).json({ success: false, error: "Payment not found" });
      }
      
      res.json({ success: true, data: payment });
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ success: false, error: "Failed to fetch payment" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parsedData = createPaymentSchema.parse(req.body);
      const payment = await PaymentsService.createPayment({
        ...(parsedData as any),
        created_by: req.user?.id,
        payment_date: parsedData.payment_date ? new Date(parsedData.payment_date) : undefined
      });
      res.status(201).json({ success: true, data: payment });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      if (error.code === 'P2002') {
        return res.status(409).json({ success: false, error: "Payment code already exists" });
      }
      if (error.message === "Transaction not found" || error.message === "Transaction does not belong to the specified farmer" || error.message === "Payment amount exceeds outstanding balance") {
        return res.status(400).json({ success: false, error: error.message });
      }
      console.error("Error creating payment:", error);
      res.status(500).json({ success: false, error: "Failed to create payment" });
    }
  }
};
