import { AppDataSource } from "../config/database";
import { Admin } from "../entities/Admin";
import { CreateAdminDto } from "../dtos/admin.dto";

const adminRepo = AppDataSource.getRepository(Admin);

export async function createAdmin(dto: CreateAdminDto) {
    const admin = adminRepo.create({ name: dto.name, email: dto.email });
    return adminRepo.save(admin);
}

export async function findAllAdmins(search?: string, page = 1, limit = 10) {
    const qb = adminRepo.createQueryBuilder("admin");

    if (search) {
        qb.where(
            "LOWER(admin.name) LIKE :search OR LOWER(admin.email) LIKE :search",
            { search: `%${search.toLowerCase()}%` }
        );
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
}

export function findOneAdmin(id: number) {
    return adminRepo.findOne({ where: { id }, relations: ["items"] });
}

export async function updateAdmin(id: number, body: Partial<CreateAdminDto>) {
    await adminRepo.update(id, body);
    return findOneAdmin(id);
}

export function removeAdmin(id: number) {
    return adminRepo.delete(id);
}
