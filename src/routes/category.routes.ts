import { Router } from "express";
import * as categoryController from "../controllers/category.controller";

const router = Router();

router.post("/", categoryController.createCategory);
router.get("/", categoryController.findAllCategories);
router.get("/:id", categoryController.findOneCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
