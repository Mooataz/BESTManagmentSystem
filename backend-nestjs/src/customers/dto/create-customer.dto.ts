import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    name?: string;
    
    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsNumber()
    phone?: number;
}
