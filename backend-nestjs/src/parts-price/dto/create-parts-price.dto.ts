import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreatePartsPriceDto {
    @ApiProperty({
        type: Number,
        description: "Required"
    })
    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ type: Number, description: 'ID of the associated model' })
    @IsNumber()
    modelId: number;

    @ApiProperty({ type: Number, description: 'ID of the associated allPart' })
    @IsNumber()
    allPartId: number;

    @ApiProperty({
        type: Number,
        description: "Required"
    })
    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    laborCharge: number;
}
