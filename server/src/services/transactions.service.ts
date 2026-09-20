import { prisma } from "../config/prisma.js";
import { Prisma } from "../../../generated/prisma/client";

export const TransactionsService = {
  async getAllTransactions() {
    return prisma.transactions.findMany({
      orderBy: { transaction_date: 'desc' },
      include: {
        farmers: {
          select: { first_name: true, last_name: true, farmer_code: true }
        },
        inventory_items: {
          select: { name: true, sku: true }
        }
      }
    });
  },

  async getTransactionById(id: string) {
    return prisma.transactions.findUnique({
      where: { id },
      include: {
        farmers: true,
        inventory_items: true
      }
    });
  },

  async createTransaction(data: {
    transaction_code: string;
    farmer_id: string;
    inventory_item_id?: string;
    type: string;
    description?: string;
    quantity?: number;
    unit_price?: number;
    amount: number;
    transaction_date?: Date;
  }) {
    // Start with balance = amount
    return prisma.transactions.create({
      data: {
        transaction_code: data.transaction_code,
        farmer_id: data.farmer_id,
        inventory_item_id: data.inventory_item_id,
        type: data.type,
        description: data.description,
        quantity: data.quantity ? new Prisma.Decimal(data.quantity) : undefined,
        unit_price: data.unit_price ? new Prisma.Decimal(data.unit_price) : undefined,
        amount: new Prisma.Decimal(data.amount),
        balance: new Prisma.Decimal(data.amount), // Initial balance is the full amount
        paid_amount: new Prisma.Decimal(0),
        status: 'UNPAID',
        transaction_date: data.transaction_date
      }
    });
  },

  async updateTransaction(id: string, data: Partial<{
    type: string;
    description?: string;
    quantity?: number;
    unit_price?: number;
    amount: number;
  }>) {
    // If we update the amount, we must recalculate balance and status.
    // However, it's safer to fetch the existing transaction first.
    
    if (data.amount !== undefined) {
      return prisma.$transaction(async (tx) => {
        const existing = await tx.transactions.findUnique({ where: { id } });
        if (!existing) throw new Error("Transaction not found");
        
        const paid_amount = Number(existing.paid_amount);
        const new_amount = data.amount as number;
        
        if (new_amount < paid_amount) {
          throw new Error("New amount cannot be less than already paid amount");
        }
        
        const new_balance = new_amount - paid_amount;
        let new_status = 'UNPAID';
        if (new_balance <= 0) new_status = 'PAID';
        else if (paid_amount > 0) new_status = 'PARTIALLY_PAID';
        
        return tx.transactions.update({
          where: { id },
          data: {
            type: data.type,
            description: data.description,
            quantity: data.quantity ? new Prisma.Decimal(data.quantity) : undefined,
            unit_price: data.unit_price ? new Prisma.Decimal(data.unit_price) : undefined,
            amount: new Prisma.Decimal(new_amount),
            balance: new Prisma.Decimal(new_balance),
            status: new_status,
            updated_at: new Date()
          }
        });
      });
    }

    return prisma.transactions.update({
      where: { id },
      data: {
        type: data.type,
        description: data.description,
        quantity: data.quantity ? new Prisma.Decimal(data.quantity) : undefined,
        unit_price: data.unit_price ? new Prisma.Decimal(data.unit_price) : undefined,
        updated_at: new Date()
      }
    });
  }
};
