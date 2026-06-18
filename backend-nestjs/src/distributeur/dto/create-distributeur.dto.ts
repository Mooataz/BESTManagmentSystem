import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDistributeurDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsNumber()
    phone?: number;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    taxRegisterNumber?: string;
}
