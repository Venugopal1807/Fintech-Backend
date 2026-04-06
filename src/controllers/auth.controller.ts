import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { loginSchema } from "../validations/auth.schema";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials = loginSchema.parse(req.body);
      const result = await AuthService.login(credentials);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
