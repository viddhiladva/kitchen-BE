import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Level } from "./Level";
import { KitchenCategory } from "./KitchenCategory";
import { Admin } from "./Admin";

@Entity()
export class KitchenItem {
    @PrimaryGeneratedColumn()
    "id": number;

    @Column()
    "name": string;

    @ManyToOne(() => Level, (level) => level.items, {  eager: true,
        onDelete: "SET NULL",
        nullable: true })
    "level": Level;

    @ManyToOne(() => KitchenCategory, (category) => category.items, { eager: true,
        onDelete: "SET NULL",
        nullable: true})
    "category": KitchenCategory;

    @ManyToOne(() => Admin, (admin) => admin.items, {  eager: true,
        onDelete: "SET NULL",
        nullable: true })
    "admin": Admin;
}
