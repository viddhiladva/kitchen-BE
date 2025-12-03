import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { KitchenItem } from "./KitchenItem";

@Entity()
export class Level {
    @PrimaryGeneratedColumn()
    "id": number;

    @Column({ unique: true })
    "name": string;

    @OneToMany(() => KitchenItem, (item) => item.level)
    "items": KitchenItem[];
}
