import { Router } from "express";
import * as adminController from "../controllers/admin.controller";

const router = Router();

router.post("/", adminController.createAdmin);
router.get("/", adminController.findAllAdmins);
router.get("/:id", adminController.findOneAdmin);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

export default router;
