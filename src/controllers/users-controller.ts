import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } });

    if (userWithSameEmail) {
      throw new AppError("This e-mail is already registered.");
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }
}

export { UsersController };
