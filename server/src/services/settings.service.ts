import { prisma } from "../config/prisma.js";

export const SettingsService = {
  async getSettings() {
    let settings = await prisma.settings.findUnique({
      where: { id: "default_settings" }
    });
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "default_settings",
          business_name: "",
          registration_number: "",
          address: "",
          email: "",
          phone: ""
        }
      });
    }
    
    return settings;
  },
  
  async updateSettings(data: any) {
    return prisma.settings.update({
      where: { id: "default_settings" },
      data: {
        business_name: data.businessName,
        registration_number: data.registrationNumber,
        address: data.address,
        email: data.email,
        phone: data.phone,
        updated_at: new Date()
      }
    });
  }
};
