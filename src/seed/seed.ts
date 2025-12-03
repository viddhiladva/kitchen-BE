import { Level } from "../entities/Level";
import { KitchenCategory } from "../entities/KitchenCategory";
import { Admin } from "../entities/Admin";
import { KitchenItem } from "../entities/KitchenItem";
import { AppDataSource } from "../config/database";

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected!");

        const levelRepo = AppDataSource.getRepository(Level);
        const catRepo = AppDataSource.getRepository(KitchenCategory);
        const adminRepo = AppDataSource.getRepository(Admin);
        const itemRepo = AppDataSource.getRepository(KitchenItem);

        // Clear existing data (optional - comment out if you want to keep existing data)
        // Note: Must delete items first due to foreign key constraints
        await itemRepo.createQueryBuilder().delete().execute();
        await levelRepo.createQueryBuilder().delete().execute();
        await catRepo.createQueryBuilder().delete().execute();
        await adminRepo.createQueryBuilder().delete().execute();

        const levels = await levelRepo.save([
            { name: "Easy" },
            { name: "Medium" },
            { name: "Hard" }
        ]);
        console.log(`Created ${levels.length} levels`);

        const categories = await catRepo.save([
            { name: "Vegetables" },
            { name: "Utensils" },
            { name: "Fruits" },
            { name: "Appliances" }
        ]);
        console.log(`Created ${categories.length} categories`);

        const admins = await adminRepo.save([
            { name: "Alice", email: "alice@example.com" },
            { name: "Bob", email: "bob@example.com" }
        ]);
        console.log(`Created ${admins.length} admins`);

        const items = [
            { name: "Knife", level: levels[0], category: categories[1], admin: admins[0] },
            { name: "Tomato", level: levels[0], category: categories[0], admin: admins[1] },
            { name: "Cutting Board", level: levels[0], category: categories[1], admin: admins[1] },
            { name: "Frying Pan", level: levels[1], category: categories[1], admin: admins[0] },
            { name: "Spatula", level: levels[1], category: categories[1], admin: admins[0] },
            { name: "Carrot", level: levels[0], category: categories[0], admin: admins[1] },
            { name: "Bowl", level: levels[0], category: categories[1], admin: admins[0] },
            { name: "Bread Knife", level: levels[1], category: categories[1], admin: admins[1] }
        ];

        await itemRepo.save(items);
        console.log(`Created ${items.length} kitchen items`);

        console.log("✅ Database seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await AppDataSource.destroy();
        process.exit(0);
    }
}

seed();
