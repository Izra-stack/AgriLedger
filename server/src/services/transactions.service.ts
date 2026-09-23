import { prisma } from "../config/prisma.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { randomUUID } from "node:crypto";

export const TransactionsService = {
  async getAllTransactions() {
    return prisma.transactions.findMany({
      where: { archived_at: null },
      orderBy: { transaction_date: 'desc' },
      include: {
        farmers: {
          select: { first_name: true, last_name: true, farmer_code: true }
        },
        inventory_items: {
          select: { name: true, sku: true }
        },
        transaction_items: true,
      }
    });
  },

  async getTransactionById(id: string) {
    return prisma.transactions.findUnique({
      where: { id },
      include: {
        farmers: true,
        inventory_items: true,
        transaction_items: true,
      }
    });
  },

  async createTransaction(data: {
    transaction_code?: string;
    farmer_id: string;
    inventory_item_id?: string;
    type: string;
    description?: string;
    quantity?: number;
    unit_price?: number;
    amount: number;
    transaction_date?: Date;
    created_by?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const farmer = await tx.farmers.findFirst({ where: { id: data.farmer_id, archived_at: null } });
      if (!farmer) throw new Error("Farmer not found or inactive");
      const inventory = data.inventory_item_id ? await tx.inventory_items.findFirst({ where: { id: data.inventory_item_id, archived_at: null } }) : null;
      if (data.inventory_item_id && !inventory) throw new Error("Inventory item not found or inactive");
      const quantity = data.quantity ?? 1;
      if (inventory && Number(inventory.quantity) < quantity) throw new Error("Insufficient inventory stock");
      const transaction = await tx.transactions.create({ data: {
        transaction_code: data.transaction_code || `TRX-${randomUUID().slice(0, 8).toUpperCase()}`,
        farmer_id: data.farmer_id, inventory_item_id: data.inventory_item_id, type: data.type, description: data.description,
        quantity: data.quantity !== undefined ? new Prisma.Decimal(data.quantity) : undefined,
        unit_price: data.unit_price !== undefined ? new Prisma.Decimal(data.unit_price) : undefined,
        amount: new Prisma.Decimal(data.amount), balance: new Prisma.Decimal(data.amount), paid_amount: new Prisma.Decimal(0), status: "UNPAID", transaction_date: data.transaction_date,
      }});
      if (inventory && data.created_by) {
        const after = Number(inventory.quantity) - quantity;
        await tx.transaction_items.create({ data: { transaction_id: transaction.id, inventory_item_id: inventory.id, quantity: new Prisma.Decimal(quantity), unit_price: new Prisma.Decimal(data.unit_price ?? Number(inventory.unit_cost)), line_total: new Prisma.Decimal(data.amount) } });
        await tx.inventory_items.update({ where: { id: inventory.id }, data: { quantity: new Prisma.Decimal(after), status: after <= 0 ? "OUT_OF_STOCK" : after <= Number(inventory.reorder_level) ? "LOW_STOCK" : "IN_STOCK", updated_at: new Date() } });
        await tx.inventory_movements.create({ data: { inventory_item_id: inventory.id, transaction_id: transaction.id, created_by: data.created_by, movement_type: "ISSUE", quantity: new Prisma.Decimal(-quantity), quantity_before: inventory.quantity, quantity_after: new Prisma.Decimal(after), reference: transaction.transaction_code } });
      }
      return transaction;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
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
            quantity: data.quantity !== undefined ? new Prisma.Decimal(data.quantity) : undefined,
            unit_price: data.unit_price !== undefined ? new Prisma.Decimal(data.unit_price) : undefined,
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
        quantity: data.quantity !== undefined ? new Prisma.Decimal(data.quantity) : undefined,
        unit_price: data.unit_price !== undefined ? new Prisma.Decimal(data.unit_price) : undefined,
        updated_at: new Date()
      }
    });
  }
};
