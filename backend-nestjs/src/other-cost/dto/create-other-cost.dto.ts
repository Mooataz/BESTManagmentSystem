import { ApiProperty } from "@nestjs/swagger";

export class CreateOtherCostDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    name :string;

    @ApiProperty({
        type: Number,
        format: 'float',
        description: "Required"
    })
    price : number;
}
