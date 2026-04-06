import { Router } from "express";
import { RecordController } from "../controllers/record.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);

router.get("/", RecordController.getRecords);
router.post("/", requireRole([Role.ADMIN, Role.ANALYST]), RecordController.createRecord);
router.put("/:id", requireRole([Role.ADMIN, Role.ANALYST]), RecordController.updateRecord);
router.delete("/:id", requireRole([Role.ADMIN]), RecordController.deleteRecord);

export default router;
