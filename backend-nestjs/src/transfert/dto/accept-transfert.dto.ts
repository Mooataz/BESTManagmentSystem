import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class AcceptTransfertDto {
    @ApiProperty({ type: String }) state?: string;
    @ApiProperty({ type: Date }) @IsOptional() receivedDate?: Date;
    @ApiProperty({ type: Number }) receiveUser?: number;
    @ApiProperty({ type: [Number] }) stockPartIds?: number[];
    @ApiProperty({ type: Number }) bin?: number;
}
