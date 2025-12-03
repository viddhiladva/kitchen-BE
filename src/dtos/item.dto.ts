import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    "name": string;

    @IsInt()
    "levelId": number;

    @IsInt()
    "categoryId": number;

    @IsInt()
    "adminId": number;
}
