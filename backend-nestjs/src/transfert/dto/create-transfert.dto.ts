import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsOptional } from "class-validator";

export class CreateTransfertDto {
    @ApiProperty({ type: String, description: "Required" }) @Optional() delivredBy: string;


    @ApiProperty({ type: Date, description: "Required" }) sendingDate: Date;

    @ApiProperty({ type: Date, description: "Required" }) @Optional() receivedDate: Date;

    @ApiProperty({ type: String, description: "Required" }) @Optional() type: string;

    @ApiProperty({ type: String, description: "Required" }) frombranch: number;

    @ApiProperty({ type: String, description: "Required" }) sendUser: number;

    @ApiProperty({ type: String, description: "Required" }) @Optional() receiveUser: number;

    @ApiProperty({ type: String, description: "Required" }) @Optional() state: string;

    @ApiProperty({ type: String, description: "Required" }) @Optional() remark: string;

    @ApiProperty({ type: Array, description: "Required" }) @Optional() repairIds: number[];

    @ApiProperty({ type: Array, description: "Required" }) @Optional() stockPartIds: number[];

    @ApiProperty({ type: Number, description: "Required" }) tobranch: number;

    @ApiProperty({ type: String, description: "Required" }) @Optional() typePart: string;
}
