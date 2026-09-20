import { prisma } from "../config/prisma.js";
import { Prisma } from "../../../generated/prisma/client";

export const InventoryService = {
  async getAllItems() {
    return prisma.inventory_items.findMany({
      orderBy: { created_at: 'desc' }
    });
  },

  async getItemById(id: string) {
    return prisma.inventory_items.findUnique({
      where: { id }
    });
  },

  async createItem(data: {
    sku: string;
    name: string;
    category: string;
    description?: string;
    unit: string;
    quantity: number;
    unit_cost: number;
    reorder_level: number;
    status?: string;
  }) {
    return prisma.inventory_items.create({
      data: {
        sku: data.sku,
        name: data.name,
        category: data.category,
        description: data.description,
        unit: data.unit,
        quantity: new Prisma.Decimal(data.quantity),
        unit_cost: new Prisma.Decimal(data.unit_cost),
        reorder_level: new Prisma.Decimal(data.reorder_level),
        status: data.status || 'IN_STOCK'
      }
    });
  },

  async updateItem(id: string, data: Partial<{
    name: string;
    category: string;
    description?: string;
    unit: string;
    quantity: number;
    unit_cost: number;
    reorder_level: number;
    status?: string;
  }>) {
    const updateData: any = {
      updated_at: new Date()
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.quantity !== undefined) updateData.quantity = new Prisma.Decimal(data.quantity);
    if (data.unit_cost !== undefined) updateData.unit_cost = new Prisma.Decimal(data.unit_cost);
    if (data.reorder_level !== undefined) updateData.reorder_level = new Prisma.Decimal(data.reorder_level);
    if (data.status !== undefined) updateData.status = data.status;

    return prisma.inventory_items.update({
      where: { id },
      data: updateData
    });
  },

  async deleteItem(id: string) {
    return prisma.inventory_items.delete({
      where: { id }
    });
  }
};
