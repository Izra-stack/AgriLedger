import { prisma } from "../config/prisma.js";

export const NotificationsService = {
  async getDismissedKeys(userId: string) {
    const rows = await prisma.notification_dismissals.findMany({
      where: { user_id: userId },
      select: { notification_key: true },
    });
    return rows.map((row) => row.notification_key);
  },

  async dismiss(userId: string, notificationKey: string) {
    return prisma.notification_dismissals.upsert({
      where: {
        user_id_notification_key: {
          user_id: userId,
          notification_key: notificationKey,
        },
      },
      create: { user_id: userId, notification_key: notificationKey },
      update: { dismissed_at: new Date() },
    });
  },
};
