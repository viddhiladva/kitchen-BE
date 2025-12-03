import { AppDataSource } from "../config/database";
import { Level } from "../entities/Level";
import { CreateLevelDto } from "../dtos/level.dto";

const levelRepo = AppDataSource.getRepository(Level);

export async function createLevel(dto: CreateLevelDto) {
    const level = levelRepo.create({ name: dto.name });
    return levelRepo.save(level);
}

export async function findAllLevels(search?: string, page = 1, limit = 10) {
    const qb = levelRepo.createQueryBuilder("level");

    if (search) {
        qb.where("LOWER(level.name) LIKE :search", { search: `%${search.toLowerCase()}%` });
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
}

export function findOneLevel(id: number) {
    return levelRepo.findOne({ where: { id }, relations: ["items"] });
}

export async function updateLevel(id: number, body: Partial<CreateLevelDto>) {
    await levelRepo.update(id, body);
    return findOneLevel(id);
}

export function removeLevel(id: number) {
    return levelRepo.delete(id);
}
