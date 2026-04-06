import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);

router.get("/summary", requireRole([Role.VIEWER, Role.ANALYST, Role.ADMIN]), DashboardController.getSummary);
router.get("/category-breakdown", requireRole([Role.VIEWER, Role.ANALYST, Role.ADMIN]), DashboardController.getCategoryBreakdown);

export default router;
