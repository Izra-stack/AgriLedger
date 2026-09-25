import { Request, Response } from "express";
import { FarmersService } from "../services/farmers.service.js";
import { z } from "zod";

const createFarmerSchema = z.object({
  farmer_code: z.string().min(1).max(30).optional(),
  full_name: z.string().min(1, "Full name is required").max(250),
  phone: z.string().max(30).optional(),
  address: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  area: z.number().min(0).max(999999).default(0),
  commitment: z.enum(["CASH_ASSISTANCE", "FARM_INPUT", "BOTH"]).default("BOTH"),
  notes: z.string().max(2000).optional()
});

const updateFarmerSchema = createFarmerSchema.partial();

export const FarmersController = {
  async getAll(req: Request, res: Response) {
    try {
      const farmers = await FarmersService.getAllFarmers();
      res.json({ success: true, data: farmers });
    } catch (error) {
      console.error("Error fetching farmers:", error);
      res.status(500).json({ success: false, error: "Failed to fetch farmers" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const farmer = await FarmersService.getFarmerById(id);
      
      if (!farmer) {
        return res.status(404).json({ success: false, error: "Farmer not found" });
      }
      
      res.json({ success: true, data: farmer });
    } catch (error) {
      console.error("Error fetching farmer:", error);
      res.status(500).json({ success: false, error: "Failed to fetch farmer" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parsedData = createFarmerSchema.parse(req.body);
      if (!req.user) return res.status(403).json({ success: false, error: "Owner authentication required" });
      const farmer = await FarmersService.createFarmer({ ...(parsedData as any), created_by: req.user.id });
      res.status(201).json({ success: true, data: farmer });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      if (error.code === 'P2002') {
        return res.status(409).json({ success: false, error: "Farmer code already exists" });
      }
      console.error("Error creating farmer:", error);
      res.status(500).json({ success: false, error: "Failed to create farmer" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const parsedData = updateFarmerSchema.parse(req.body);
      const farmer = await FarmersService.updateFarmer(id, parsedData as any);
      res.json({ success: true, data: farmer });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: "Farmer not found" });
      }
      console.error("Error updating farmer:", error);
      res.status(500).json({ success: false, error: "Failed to update farmer" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await FarmersService.deleteFarmer(id);
      res.json({ success: true, message: "Farmer archived successfully" });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: "Farmer not found" });
      }
      if (error.code === 'P2003') {
        return res.status(409).json({ 
          success: false, 
          error: "Cannot delete farmer with associated transactions or payments" 
        });
      }
      console.error("Error deleting farmer:", error);
      res.status(500).json({ success: false, error: "Failed to delete farmer" });
    }
  }
};
