import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    name?: string;
    
    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    status?: string;
}
