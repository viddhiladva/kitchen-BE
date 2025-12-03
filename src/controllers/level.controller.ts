import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import { CreateLevelDto } from "../dtos/level.dto";
import * as levelService from "../services/level.service";

export async function createLevel(req: Request, res: Response) {
    try {
        const dto = Object.assign(new CreateLevelDto(), req.body);
        await validateOrReject(dto);

        const level = await levelService.createLevel(dto);
        res.status(201).json(level);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

export async function findAllLevels(req: Request, res: Response) {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const levels = await levelService.findAllLevels(
            search?.toString(),
            Number(page),
            Number(limit)
        );

        res.json(levels);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function findOneLevel(req: Request, res: Response) {
    try {
        const level = await levelService.findOneLevel(Number(req.params.id));
        if (!level) {
            return res.status(404).json({ error: "Level not found" });
        }
        res.json(level);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function updateLevel(req: Request, res: Response) {
    try {
        const dto = Object.assign(new CreateLevelDto(), req.body);
        await validateOrReject(dto, { skipMissingProperties: true });

        const updated = await levelService.updateLevel(Number(req.params.id), dto);
        if (!updated) {
            return res.status(404).json({ error: "Level not found" });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

export async function deleteLevel(req: Request, res: Response) {
    try {
        await levelService.removeLevel(Number(req.params.id));
        res.json({ message: "Level deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
