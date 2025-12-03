import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { KitchenItem } from "./KitchenItem";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    "id": number;

    @Column()
    "name": string;

    @Column({ unique: true })
    "email": string;

    @OneToMany(() => KitchenItem, (item) => item.admin)
    "items": KitchenItem[];
}
