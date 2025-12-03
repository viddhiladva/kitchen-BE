import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import { CreateCategoryDto } from "../dtos/category.dto";
import * as categoryService from "../services/category.service";

export async function createCategory(req: Request, res: Response) {
    try {
        const dto = Object.assign(new CreateCategoryDto(), req.body);
        await validateOrReject(dto);

        const category = await categoryService.createCategory(dto);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

export async function findAllCategories(req: Request, res: Response) {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const categories = await categoryService.findAllCategories(
            search?.toString(),
            Number(page),
            Number(limit)
        );

        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function findOneCategory(req: Request, res: Response) {
    try {
        const category = await categoryService.findOneCategory(Number(req.params.id));
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function updateCategory(req: Request, res: Response) {
    try {
        const dto = Object.assign(new CreateCategoryDto(), req.body);
        await validateOrReject(dto, { skipMissingProperties: true });

        const updated = await categoryService.updateCategory(Number(req.params.id), dto);
        if (!updated) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

export async function deleteCategory(req: Request, res: Response) {
    try {
        await categoryService.removeCategory(Number(req.params.id));
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
