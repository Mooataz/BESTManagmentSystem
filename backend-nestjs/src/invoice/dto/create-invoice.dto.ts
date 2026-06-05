import { ApiProperty } from "@nestjs/swagger";

export class CreateInvoiceDto {
    @ApiProperty({ type: String, description: "Required" })
    paymentMethod?: string;

    @ApiProperty({ type: Date, description: "Required" })
    date?: Date;

    @ApiProperty({ type: String, description: "Required" })
    state?: string;

    @ApiProperty({ type: Number, description: "Required" })
    totalPrice?: number;

    @ApiProperty({ type: Number })
    tva?: number;

    @ApiProperty({ type: Number })
    timbreFiscale?: number;

    @ApiProperty({ type: Number })
    partsTotal?: number;

    @ApiProperty({ type: Number })
    levelRepairPrice?: number;

    @ApiProperty({ type: Number })
    otherCostsTotal?: number;

    @ApiProperty({ type: Array, description: "Required" })
    otherCost?: number[];

    @ApiProperty({ type: Number, description: "Required" })
    repair?: number;

    @ApiProperty({ type: Number, description: "Required" })
    user?: number;
}
