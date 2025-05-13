import { ApiProperty } from "@nestjs/swagger";

export class CreateHistoryRepairDto {
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

    @ApiProperty({ type: Number})
    repair: number;
}
