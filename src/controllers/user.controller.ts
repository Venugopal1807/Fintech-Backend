import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { createUserSchema, updateUserSchema } from "../validations/user.schema";

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await UserService.createUser(validatedData);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = updateUserSchema.parse(req.body);
      const user = await UserService.updateUser(req.params.id as string, validatedData);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}
