import { ApiProperty } from "@nestjs/swagger";

export class CreateHistoryStockPartDto {
    @ApiProperty({
        type: Date,
        description: "Required"
    })
    date: Date;

    @ApiProperty({
        type: String,
        description: "Required"
    })
    step: string;

}
