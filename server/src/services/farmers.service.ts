import { prisma } from "../config/prisma.js";
import { randomUUID } from "node:crypto";

export const FarmersService = {
  async getAllFarmers() {
    return prisma.farmers.findMany({
      where: { archived_at: null },
      orderBy: { created_at: 'desc' }
    });
  },

  async getFarmerById(id: string) {
    return prisma.farmers.findFirst({
      where: { id, archived_at: null }
    });
  },

  async createFarmer(data: {
    created_by: string;
    farmer_code?: string;
    full_name: string;
    phone?: string;
    address?: string;
    area: number;
    commitment: string;
    notes?: string;
    status?: string;
  }) {
    return prisma.farmers.create({
      data: {
        ...data,
        farmer_code: data.farmer_code || `FRM-${randomUUID().slice(0, 8).toUpperCase()}`,
      }
    });
  },

  async updateFarmer(id: string, data: Partial<{
    full_name: string;
    phone?: string;
    address?: string;
    area?: number;
    commitment?: string;
    notes?: string;
    status?: string;
  }>) {
    // Explicitly update updated_at if not handled by db
    return prisma.farmers.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
  },

  async deleteFarmer(id: string) {
    return prisma.farmers.update({
      where: { id },
      data: { status: "INACTIVE", archived_at: new Date(), updated_at: new Date() },
    });
  }
};
