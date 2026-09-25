import { prisma } from "../config/prisma.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { randomUUID } from "node:crypto";

export const PaymentsService = {
  async getAllPayments() {
    return prisma.payments.findMany({
      where: { archived_at: null },
      orderBy: { payment_date: 'desc' },
      include: {
        farmers: {
          select: { full_name: true, farmer_code: true }
        },
        transactions: {
          select: { transaction_code: true, type: true, amount: true, status: true }
        }
      }
    });
  },

  async getPaymentById(id: string) {
    return prisma.payments.findFirst({
      where: { id },
      include: { farmers: true, transactions: true }
    });
  },

  async createPayment(data: {
    payment_code?: string;
    farmer_id: string;
    transaction_id: string;
    amount: number;
    payment_method: string;
    reference_number?: string;
    notes?: string;
    payment_date?: Date;
    created_by?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Get the transaction to check balance
      const transaction = await tx.transactions.findFirst({
        where: { id: data.transaction_id }
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.farmer_id !== data.farmer_id) {
        throw new Error("Transaction does not belong to the specified farmer");
      }

      if (transaction.archived_at) throw new Error("Transaction is archived");
      const paymentAmount = data.amount;
      const currentBalance = Number(transaction.balance);
      const currentPaid = Number(transaction.paid_amount);

      if (paymentAmount > currentBalance) {
        throw new Error("Payment amount exceeds outstanding balance");
      }

      const newBalance = currentBalance - paymentAmount;
      const newPaid = currentPaid + paymentAmount;
      
      let newStatus = 'UNPAID';
      if (newBalance <= 0) newStatus = 'PAID';
      else if (newPaid > 0) newStatus = 'PARTIALLY_PAID';

      // 2. Create the payment
      const payment = await tx.payments.create({
        data: {
          payment_code: data.payment_code || `PAY-${randomUUID().slice(0, 8).toUpperCase()}`,
          farmer_id: data.farmer_id,
          transaction_id: data.transaction_id,
          amount: new Prisma.Decimal(paymentAmount),
          payment_method: data.payment_method,
          reference_number: data.reference_number,
          notes: data.notes,
          payment_date: data.payment_date
        }
      });

      // 3. Update the transaction
      await tx.transactions.update({
        where: { id: data.transaction_id },
        data: {
          paid_amount: new Prisma.Decimal(newPaid),
          balance: new Prisma.Decimal(newBalance),
          status: newStatus,
          updated_at: new Date()
        }
      });

      return payment;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
};
