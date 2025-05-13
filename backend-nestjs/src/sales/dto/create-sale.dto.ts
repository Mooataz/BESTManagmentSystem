import { ApiProperty } from "@nestjs/swagger";

export class CreateSaleDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    state: string;

    @ApiProperty({
        type: Number,
        format:('Float'),
        description: "Required"
    })
    totalPrice: number;

    @ApiProperty({
        type: Date,
        description: "Required"
    })
    date: Date;
}
