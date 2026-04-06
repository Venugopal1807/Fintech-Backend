import { z } from "zod";

const RoleEnum = z.enum(["VIEWER", "ANALYST", "ADMIN"]);
const UserStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: RoleEnum.optional(),
  status: UserStatusEnum.optional(),
});

export const updateUserSchema = z.object({
  role: RoleEnum.optional(),
  status: UserStatusEnum.optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
