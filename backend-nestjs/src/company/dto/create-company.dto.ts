import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateCompanyDto {
    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    headquarterslocation?: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    taxRegisterNumber?: string;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsNumber()
    rib?: number;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    logo?: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    bank?: string;
    
    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsNumber()
    quantityAlertStock?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsPositive()
    tva?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsPositive()
    timbreFiscale?: number;
}
