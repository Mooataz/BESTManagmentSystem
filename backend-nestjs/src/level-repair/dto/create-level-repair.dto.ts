import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLevelRepairDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ type: Number })
    @IsNumber()
    @IsNotEmpty()
    price!: number;
    
}
