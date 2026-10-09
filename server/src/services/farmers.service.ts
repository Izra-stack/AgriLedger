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
    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('agriledger_farmer_code'))`;
      await tx.$executeRaw`CREATE SEQUENCE IF NOT EXISTS farmer_code_seq`;
      await tx.$executeRaw`
        SELECT setval(
          'farmer_code_seq',
          GREATEST(
            COALESCE((
              SELECT MAX((substring(farmer_code FROM '^FRM-([0-9]+)$'))::bigint)
              FROM farmers
              WHERE farmer_code ~ '^FRM-[0-9]+$'
            ), 0),
            CASE
              WHEN (SELECT is_called FROM farmer_code_seq)
              THEN (SELECT last_value FROM farmer_code_seq)
              ELSE 0
            END,
            1
          ),
          COALESCE((
            SELECT MAX((substring(farmer_code FROM '^FRM-([0-9]+)$'))::bigint) > 0
            FROM farmers
            WHERE farmer_code ~ '^FRM-[0-9]+$'
          ), false)
          OR (SELECT is_called FROM farmer_code_seq)
        )
      `;

      const [{ farmer_code: farmerCode }] = await tx.$queryRaw<Array<{ farmer_code: string }>>`
        SELECT 'FRM-' || LPAD(nextval('farmer_code_seq')::text, 6, '0') AS farmer_code
      `;

      return tx.farmers.create({
        data: {
          ...data,
          farmer_code: farmerCode,
          status: "ACTIVE",
          commitment: "BOTH",
        },
      });
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
