import { prisma } from "./prisma";
import { CRUDFactory } from "./factory";

export const shopFactory = new CRUDFactory(prisma, "Shop", prisma.shop);

// Helper to get shops with owner and menu items
export async function getShopsWithRelations(options?: {
  where?: any;
  orderBy?: any;
}) {
  return shopFactory.getAll({
    where: options?.where,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      menuItems: true,
    },
    orderBy: options?.orderBy || { createdAt: "desc" },
  });
}

// Helper to get single shop with relations
export async function getShopByIdWithRelations(id: string) {
  return shopFactory.getById(id, {
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      menuItems: true,
    },
  });
}
