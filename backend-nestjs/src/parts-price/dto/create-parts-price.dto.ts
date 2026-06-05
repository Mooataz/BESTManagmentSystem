import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class CreatePartsPriceDto {
    @ApiProperty({
        type: Number,
        description: "Required"
    })
    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    price!: number;

    @ApiProperty({ type: Number, description: 'ID of the associated model' })
    @IsOptional()
    @IsNumber()
    modelId?: number;

    @ApiProperty({ type: Number, description: 'ID of the associated allPart' })
    @IsOptional()
    @IsNumber()
    allPartId?: number;

    @ApiProperty({
        type: Number,
        description: "Required"
    })
    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    laborCharge?: number;
}
