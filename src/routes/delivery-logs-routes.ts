import { Router } from "express";
import { DeliveryLogController } from "@/controllers/delivery-logs-controller";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveryLogsRoutes = Router();
const deliveryLogsController = new DeliveryLogController();

deliveryLogsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["seller"]),
  deliveryLogsController.create
);

deliveryLogsRoutes.get(
  "/:delivery_id/show",
  ensureAuthenticated,
  verifyUserAuthorization(["seller", "customer"]),
  deliveryLogsController.show
);

export { deliveryLogsRoutes };
