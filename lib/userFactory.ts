import { prisma } from "./prisma";
import { CRUDFactory } from "./factory";
import { createUserSchema, updateUserSchema } from "./validations";
import bcrypt from "bcryptjs";

export const userFactory = new CRUDFactory(prisma, "User", prisma.user);

export async function createUserWithPassword(data: any) {
  // Validate input
  const validated = createUserSchema.parse(data);

  // Hash password
  const hashedPassword = await bcrypt.hash(validated.password, 10);

  // Create user with hashed password
  const userData = {
    ...validated,
    password: hashedPassword,
  };

  return userFactory.create(userData, { exclude: ["password"] });
}

export async function updateUserWithPassword(id: string, data: any) {
  // Validate input
  const validated = updateUserSchema.parse(data);

  // Hash password if provided
  const updateData: any = { ...validated };
  if (validated.password) {
    updateData.password = await bcrypt.hash(validated.password, 10);
  }

  return userFactory.update(id, updateData, { exclude: ["password"] });
}

// Helper to get all users without passwords
export async function getAllUsersWithoutPassword() {
  const response = await userFactory.getAll({
    orderBy: { createdAt: "desc" },
  });

  const data = await response.json();
  if (data.success && data.data) {
    data.data = data.data.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  return Response.json(data, { status: response.status });
}

// Helper to get user by ID without password
export async function getUserByIdWithoutPassword(id: string) {
  const response = await userFactory.getById(id);

  const data = await response.json();
  if (data.success && data.data) {
    const { password, ...userWithoutPassword } = data.data;
    data.data = userWithoutPassword;
  }

  return Response.json(data, { status: response.status });
}
