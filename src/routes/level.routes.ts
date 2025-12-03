import { Router } from "express";
import * as levelController from "../controllers/level.controller";

const router = Router();

router.post("/", levelController.createLevel);
router.get("/", levelController.findAllLevels);
router.get("/:id", levelController.findOneLevel);
router.put("/:id", levelController.updateLevel);
router.delete("/:id", levelController.deleteLevel);

export default router;
