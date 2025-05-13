import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBinDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsNotEmpty()
    type: string;

    @ApiProperty({
        type: Number,
        description: "Required"
    })
    @IsNotEmpty()
    branch: number;
}
