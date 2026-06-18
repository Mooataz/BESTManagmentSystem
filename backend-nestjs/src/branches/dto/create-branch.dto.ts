import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBranchDto {
    @ApiProperty({ type: String })
    @IsString()
    name!: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsNumber()
    phone?: number;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsEmail()
    email?: string;
    
    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsNumber()
    company?: number;

}
