import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);
router.use(requireRole([Role.ADMIN])); 

router.get("/", UserController.getUsers);
router.post("/", UserController.createUser);
router.patch("/:id", UserController.updateUser);

export default router;
