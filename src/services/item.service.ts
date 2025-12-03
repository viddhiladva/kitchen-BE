import { AppDataSource } from "../config/database";
import { KitchenItem } from "../entities/KitchenItem";
import { Level } from "../entities/Level";
import { KitchenCategory } from "../entities/KitchenCategory";
import { Admin } from "../entities/Admin";
import { CreateItemDto } from "../dtos/item.dto";

const itemRepo = AppDataSource.getRepository(KitchenItem);
const levelRepo = AppDataSource.getRepository(Level);
const categoryRepo = AppDataSource.getRepository(KitchenCategory);
const adminRepo = AppDataSource.getRepository(Admin);

export async function createItem(dto: CreateItemDto) {
    const level = await levelRepo.findOneBy({ id: dto.levelId });
    const category = await categoryRepo.findOneBy({ id: dto.categoryId });
    const admin = await adminRepo.findOneBy({ id: dto.adminId });

    if (!level || !category || !admin) {
        throw new Error("Level, Category or Admin not found.");
    }

    const item = itemRepo.create({
        name: dto.name,
        level,
        category,
        admin
    });

    return itemRepo.save(item);
}

export async function findAllItems(search?: string, page = 1, limit = 10) {
    const qb = itemRepo.createQueryBuilder("item")
        .leftJoinAndSelect("item.level", "level")
        .leftJoinAndSelect("item.category", "category")
        .leftJoinAndSelect("item.admin", "admin");

    if (search) {
        qb.where("LOWER(item.name) LIKE :search", { search: `%${search.toLowerCase()}%` });
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
}

export function findOneItem(id: number) {
    return itemRepo.findOne({
        where: { id },
        relations: ["level", "category", "admin"]
    });
}

export async function updateItem(id: number, body: Partial<CreateItemDto>) {
    const item = await itemRepo.findOneBy({ id });
    if (!item) {
        throw new Error("Item not found");
    }

    if (body.levelId) {
        const level = await levelRepo.findOneBy({ id: body.levelId });
        if (!level) throw new Error("Level not found");
        item.level = level;
    }

    if (body.categoryId) {
        const category = await categoryRepo.findOneBy({ id: body.categoryId });
        if (!category) throw new Error("Category not found");
        item.category = category;
    }

    if (body.adminId) {
        const admin = await adminRepo.findOneBy({ id: body.adminId });
        if (!admin) throw new Error("Admin not found");
        item.admin = admin;
    }

    if (body.name) {
        item.name = body.name;
    }

    return itemRepo.save(item);
}

export function removeItem(id: number) {
    return itemRepo.delete(id);
}
