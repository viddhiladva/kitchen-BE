import { AppDataSource } from "../config/database";
import { KitchenCategory } from "../entities/KitchenCategory";
import { CreateCategoryDto } from "../dtos/category.dto";

const categoryRepo = AppDataSource.getRepository(KitchenCategory);

export async function createCategory(dto: CreateCategoryDto) {
    const category = categoryRepo.create({ name: dto.name });
    return categoryRepo.save(category);
}

export async function findAllCategories(search?: string, page = 1, limit = 10) {
    const qb = categoryRepo.createQueryBuilder("category");

    if (search) {
        qb.where("LOWER(category.name) LIKE :search", { search: `%${search.toLowerCase()}%` });
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
}

export function findOneCategory(id: number) {
    return categoryRepo.findOne({ where: { id }, relations: ["items"] });
}

export async function updateCategory(id: number, body: Partial<CreateCategoryDto>) {
    await categoryRepo.update(id, body);
    return findOneCategory(id);
}

export function removeCategory(id: number) {
    return categoryRepo.delete(id);
}
