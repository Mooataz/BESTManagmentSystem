import { ApiProperty } from "@nestjs/swagger";

export class CreateLevelRepairDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    name: string;

    @ApiProperty({
        type: Number,

        description: "Required"
    })
    price: number;
}
