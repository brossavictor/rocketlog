import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { log } from "console";
import { Request, Response } from "express";
import { z } from "zod";

class DeliveryLogController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string(),
    });

    const { delivery_id, description } = bodySchema.parse(request.body);
    const delivery = await prisma.delivery.findFirst({
      where: { id: delivery_id },
    });

    if (!delivery) {
      throw new AppError("Delivery not found.", 404);
    } else if (delivery.status === "delivered") {
      throw new AppError("This order has already been delivered.");
    } else if (delivery.status === "processing") {
      throw new AppError("Change status to shipped.");
    }

    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description,
      },
    });
    return response.status(201).json();
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(),
    });

    const { delivery_id } = paramsSchema.parse(request.params);
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: {
        logs: true,
        user: true,
      },
    });

    if (
      request.user?.role === "customer" &&
      request.user.id !== delivery?.userId
    ) {
      throw new AppError("Unknown delivery.", 401);
    }

    return response.json(delivery);
  }
}

export { DeliveryLogController };
