import { ApiProperty } from "@nestjs/swagger";

export class CreateSaleDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    state?: string;

    @ApiProperty({
        type: Number,
        format:('Float'),
        description: "Required"
    })
    totalPrice?: number;

    @ApiProperty({
        type: Date,
        description: "Required"
    })
    date?: Date;

    @ApiProperty({ type: Number, description: "User ID" })
    user?: number;

    @ApiProperty({ type: [Number], description: "AllPart IDs" })
    allPartIds?: number[];

    @ApiProperty({ type: [Number], description: "Quantities per accessory" })
    quantities?: number[];

    @ApiProperty({ type: String, description: "Customer name" })
    customerName?: string;

    @ApiProperty({ type: Number, description: "Customer phone" })
    customerPhone?: number;
}
