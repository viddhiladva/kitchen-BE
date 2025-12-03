import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import { CreateAdminDto } from "../dtos/admin.dto";
import * as adminService from "../services/admin.service";

export async function createAdmin(req: Request, res: Response) {
    try {
        const dto = Object.assign(new CreateAdminDto(), req.body);
        await validateOrReject(dto);

        const admin = await adminService.createAdmin(dto);
        res.status(201).json(admin);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

export async function findAllAdmins(req: Request, res: Response) {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const admins = await adminService.findAllAdmins(
            search?.toString(),
            Number(page),
            Number(limit)
        );

        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function findOneAdmin(req: Request, res: Response) {
    try {
        const admin = await adminService.findOneAdmin(Number(req.params.id));
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function updateAdmin(req: Request, res: Response) {
    try {
        const dto = Object.assign(new CreateAdminDto(), req.body);
        await validateOrReject(dto, { skipMissingProperties: true });

        const updated = await adminService.updateAdmin(Number(req.params.id), dto);
        if (!updated) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

export async function deleteAdmin(req: Request, res: Response) {
    try {
        await adminService.removeAdmin(Number(req.params.id));
        res.json({ message: "Admin deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
