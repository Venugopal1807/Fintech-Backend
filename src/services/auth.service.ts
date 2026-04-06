import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { LoginInput } from "../validations/auth.schema";

interface AuthResponse {
  token: string;
  user: { id: string; email: string; role: string };
}

export class AuthService {
  static async login(credentials: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
    }

    if (user.status === "INACTIVE") {
      throw Object.assign(new Error("Account is deactivated"), { statusCode: 401 });
    }

    const passwordValid = await bcrypt.compare(credentials.password, user.passwordHash);

    if (!passwordValid) {
      throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "24h" } as jwt.SignOptions
    );

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
