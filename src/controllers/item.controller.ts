import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import { CreateItemDto } from "../dtos/item.dto";
import * as itemService from "../services/item.service";

export async function createItem(req: Request, res: Response) {
    try {
        const dto = Object.assign(new CreateItemDto(), req.body);
        await validateOrReject(dto);

        const item = await itemService.createItem(dto);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

export async function findAllItems(req: Request, res: Response) {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const items = await itemService.findAllItems(
            search?.toString(),
            Number(page),
            Number(limit)
        );

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function findOneItem(req: Request, res: Response) {
    try {
        const item = await itemService.findOneItem(Number(req.params.id));
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function updateItem(req: Request, res: Response) {
    try {
        const dto = Object.assign(new CreateItemDto(), req.body);
        await validateOrReject(dto, { skipMissingProperties: true });

        const updated = await itemService.updateItem(Number(req.params.id), dto);
        if (!updated) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

export async function deleteItem(req: Request, res: Response) {
    try {
        await itemService.removeItem(Number(req.params.id));
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
