import { prisma } from "../config/prisma.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { randomUUID } from "node:crypto";

export const InventoryService = {
  async getAllItems() {
    return prisma.inventory_items.findMany({
      where: { archived_at: null },
      orderBy: { created_at: 'desc' }
    });
  },

  async getItemById(id: string) {
    return prisma.inventory_items.findFirst({
      where: { id, archived_at: null }
    });
  },

  async createItem(data: {
    sku?: string;
    name: string;
    category: string;
    description?: string;
    unit: string;
    quantity: number;
    unit_cost: number;
    reorder_level: number;
    status?: string;
    created_by?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.inventory_items.create({
      data: {
        sku: data.sku || `SKU-${randomUUID().slice(0, 8).toUpperCase()}`,
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
      if (data.created_by && data.quantity > 0) await tx.inventory_movements.create({ data: {
        inventory_item_id: item.id, created_by: data.created_by, movement_type: "INITIAL",
        quantity: new Prisma.Decimal(data.quantity), quantity_before: new Prisma.Decimal(0), quantity_after: new Prisma.Decimal(data.quantity), reference: item.sku,
      }});
      return item;
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
    created_by?: string;
  }>) {
    const updateData: any = {
      updated_at: new Date()
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.unit !== undefined) updateData.unit = data.unit;
    const existing = data.quantity !== undefined ? await prisma.inventory_items.findUnique({ where: { id } }) : null;
    if (data.quantity !== undefined) updateData.quantity = new Prisma.Decimal(data.quantity);
    if (data.unit_cost !== undefined) updateData.unit_cost = new Prisma.Decimal(data.unit_cost);
    if (data.reorder_level !== undefined) updateData.reorder_level = new Prisma.Decimal(data.reorder_level);
    if (data.status !== undefined) updateData.status = data.status;

    return prisma.$transaction(async (tx) => {
      const item = await tx.inventory_items.update({ where: { id }, data: updateData });
      if (existing && data.created_by && data.quantity !== undefined && Number(existing.quantity) !== data.quantity) await tx.inventory_movements.create({ data: {
        inventory_item_id: id, created_by: data.created_by, movement_type: "ADJUSTMENT",
        quantity: new Prisma.Decimal(data.quantity - Number(existing.quantity)), quantity_before: existing.quantity, quantity_after: new Prisma.Decimal(data.quantity), reference: "manual adjustment",
      }});
      return item;
    });
  },

  async deleteItem(id: string) {
    return prisma.inventory_items.update({ where: { id }, data: { status: "ARCHIVED", archived_at: new Date(), updated_at: new Date() } });
  }
};
