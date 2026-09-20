import { Request, Response } from "express";
import { FarmersService } from "../services/farmers.service.js";
import { z } from "zod";

const createFarmerSchema = z.object({
  farmer_code: z.string().min(1, "Farmer code is required").max(30),
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  middle_name: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  address: z.string().optional(),
  farm_location: z.string().optional(),
  status: z.string().max(20).optional()
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
      const { id } = req.params;
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
      const farmer = await FarmersService.createFarmer(parsedData);
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
      const { id } = req.params;
      const parsedData = updateFarmerSchema.parse(req.body);
      const farmer = await FarmersService.updateFarmer(id, parsedData);
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
      const { id } = req.params;
      await FarmersService.deleteFarmer(id);
      res.json({ success: true, message: "Farmer deleted successfully" });
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
