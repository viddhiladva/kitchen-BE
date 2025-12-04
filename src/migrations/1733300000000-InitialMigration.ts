import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1733300000000 implements MigrationInterface {
    name = 'InitialMigration1733300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create level table
        await queryRunner.query(`
            CREATE TABLE "level" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_level_name" UNIQUE ("name"),
                CONSTRAINT "PK_level_id" PRIMARY KEY ("id")
            )
        `);

        // Create kitchen_category table
        await queryRunner.query(`
            CREATE TABLE "kitchen_category" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_kitchen_category_name" UNIQUE ("name"),
                CONSTRAINT "PK_kitchen_category_id" PRIMARY KEY ("id")
            )
        `);

        // Create admin table
        await queryRunner.query(`
            CREATE TABLE "admin" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "UQ_admin_email" UNIQUE ("email"),
                CONSTRAINT "PK_admin_id" PRIMARY KEY ("id")
            )
        `);

        // Create kitchen_item table
        await queryRunner.query(`
            CREATE TABLE "kitchen_item" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "levelId" integer,
                "categoryId" integer,
                "adminId" integer,
                CONSTRAINT "PK_kitchen_item_id" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "kitchen_item" 
            ADD CONSTRAINT "FK_kitchen_item_level" 
            FOREIGN KEY ("levelId") 
            REFERENCES "level"("id") 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "kitchen_item" 
            ADD CONSTRAINT "FK_kitchen_item_category" 
            FOREIGN KEY ("categoryId") 
            REFERENCES "kitchen_category"("id") 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "kitchen_item" 
            ADD CONSTRAINT "FK_kitchen_item_admin" 
            FOREIGN KEY ("adminId") 
            REFERENCES "admin"("id") 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "kitchen_item" DROP CONSTRAINT "FK_kitchen_item_admin"`);
        await queryRunner.query(`ALTER TABLE "kitchen_item" DROP CONSTRAINT "FK_kitchen_item_category"`);
        await queryRunner.query(`ALTER TABLE "kitchen_item" DROP CONSTRAINT "FK_kitchen_item_level"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "kitchen_item"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TABLE "kitchen_category"`);
        await queryRunner.query(`DROP TABLE "level"`);
    }
}

