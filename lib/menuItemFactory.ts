import { prisma } from './prisma';
import { CRUDFactory } from './factory';

export const menuItemFactory = new CRUDFactory(
  prisma,
  'MenuItem',
  prisma.menuItem
);

// Helper to get menu items with filters
export async function getMenuItemsWithFilters(options?: {
  shopId?: string;
  isVeg?: boolean;
  orderBy?: any;
}) {
  const where: any = {};

  if (options?.shopId) {
    where.shopId = options.shopId;
  }

  if (options?.isVeg !== undefined) {
    where.isVeg = options.isVeg;
  }

  return menuItemFactory.getAll({
    where,
    include: {
      shop: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
    },
    orderBy: options?.orderBy || { createdAt: 'desc' },
  });
}

// Helper to get single menu item with shop relation
export async function getMenuItemByIdWithShop(id: string) {
  return menuItemFactory.getById(id, {
    include: {
      shop: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
    },
  });
}
