import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

export class CreateStockPartDto {
    @ApiProperty({ type: String, description: "Serial number" })
    @IsOptional()
    serialNumber?: string;

    @ApiProperty({ type: String, description: "Remark" })
    @IsOptional()
    remark?: string;

    @ApiProperty({ type: Number, description: "User ID" })
    @IsInt()
    userId!: number;

    @ApiProperty({ type: Number, description: "Bin ID" })
    @IsOptional()
    @IsInt()
    bin?: number;

    @ApiProperty({ type: Number, description: "Reference ID" })
    @IsOptional()
    @IsInt()
    reference?: number;
}

