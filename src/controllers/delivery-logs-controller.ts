import { NextFunction, Request, Response } from "express";

class DeliveryLogController {
  async create(request: Request, response: Response) {
    return response.json({ message: "Ok!" });
  }
}

export { DeliveryLogController };
