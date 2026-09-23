import { Request, Response } from "express";
import { InventoryService } from "../services/inventory.service.js";
import { z } from "zod";

const createInventorySchema = z.object({
  sku: z.string().min(1).max(50).optional(),
  name: z.string().min(1, "Name is required").max(150),
  category: z.string().min(1, "Category is required").max(50),
  description: z.string().optional(),
  unit: z.string().min(1, "Unit is required").max(30),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  unit_cost: z.number().min(0, "Unit cost cannot be negative"),
  reorder_level: z.number().min(0, "Reorder level cannot be negative"),
  status: z.string().max(20).optional()
});

const updateInventorySchema = createInventorySchema.partial();

export const InventoryController = {
  async getAll(req: Request, res: Response) {
    try {
      const items = await InventoryService.getAllItems();
      res.json({ success: true, data: items });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ success: false, error: "Failed to fetch inventory" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const item = await InventoryService.getItemById(id);
      
      if (!item) {
        return res.status(404).json({ success: false, error: "Item not found" });
      }
      
      res.json({ success: true, data: item });
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ success: false, error: "Failed to fetch item" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parsedData = createInventorySchema.parse(req.body);
      const item = await InventoryService.createItem({ ...(parsedData as any), created_by: req.user?.id });
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      if (error.code === 'P2002') {
        return res.status(409).json({ success: false, error: "SKU already exists" });
      }
      console.error("Error creating item:", error);
      res.status(500).json({ success: false, error: "Failed to create item" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const parsedData = updateInventorySchema.parse(req.body);
      const item = await InventoryService.updateItem(id, { ...(parsedData as any), created_by: req.user?.id });
      res.json({ success: true, data: item });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: "Item not found" });
      }
      console.error("Error updating item:", error);
      res.status(500).json({ success: false, error: "Failed to update item" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await InventoryService.deleteItem(id);
      res.json({ success: true, message: "Item archived successfully" });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: "Item not found" });
      }
      if (error.code === 'P2003') {
        return res.status(409).json({ 
          success: false, 
          error: "Cannot delete item with associated transactions" 
        });
      }
      console.error("Error deleting item:", error);
      res.status(500).json({ success: false, error: "Failed to delete item" });
    }
  }
};
