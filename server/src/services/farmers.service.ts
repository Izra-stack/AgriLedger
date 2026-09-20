import { prisma } from "../config/prisma.js";

// Utility to get a default user for created_by until Auth is implemented
const getDefaultUser = async () => {
  let user = await prisma.users.findFirst();
  if (!user) {
    user = await prisma.users.create({
      data: {
        email: "admin@agriledger.ph",
        full_name: "Admin",
        role: "OWNER"
      }
    });
  }
  return user;
};

export const FarmersService = {
  async getAllFarmers() {
    return prisma.farmers.findMany({
      orderBy: { created_at: 'desc' }
    });
  },

  async getFarmerById(id: string) {
    return prisma.farmers.findUnique({
      where: { id }
    });
  },

  async createFarmer(data: {
    farmer_code: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    phone?: string;
    address?: string;
    farm_location?: string;
    status?: string;
  }) {
    const user = await getDefaultUser();

    return prisma.farmers.create({
      data: {
        ...data,
        created_by: user.id
      }
    });
  },

  async updateFarmer(id: string, data: Partial<{
    first_name: string;
    last_name: string;
    middle_name?: string;
    phone?: string;
    address?: string;
    farm_location?: string;
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
    return prisma.farmers.delete({
      where: { id }
    });
  }
};
