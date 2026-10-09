import { prisma } from "../config/prisma.js";

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
    full_name: string;
    phone?: string;
    address?: string;
    area: number;
    notes?: string;
  }) {
    const [{ farmer_code: farmerCode }] = await prisma.$queryRaw<Array<{ farmer_code: string }>>`
      SELECT 'FRM-' || LPAD(nextval('farmer_code_seq')::text, 6, '0') AS farmer_code
    `;

    return prisma.farmers.create({
      data: {
        ...data,
        farmer_code: farmerCode,
        status: "ACTIVE",
        commitment: "BOTH",
      }
    });
  },

  async updateFarmer(id: string, data: Partial<{
    farmer_code?: string;
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
