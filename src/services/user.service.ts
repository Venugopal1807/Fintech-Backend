import { Prisma, Role, UserStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput, UpdateUserInput } from "../validations/user.schema";

const SALT_ROUNDS = 12;

export class UserService {
  static async createUser(data: CreateUserInput) {
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role as Role | undefined,
        status: data.status as UserStatus | undefined,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  static async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateUser(id: string, data: UpdateUserInput) {
    const updateData: Prisma.UserUpdateInput = {};
    if (data.role) updateData.role = data.role as Role;
    if (data.status) updateData.status = data.status as UserStatus;

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
