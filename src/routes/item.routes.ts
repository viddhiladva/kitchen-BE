import { Router } from "express";
import * as itemController from "../controllers/item.controller";

const router = Router();

router.post("/", itemController.createItem);
router.get("/", itemController.findAllItems);
router.get("/:id", itemController.findOneItem);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

export default router;
