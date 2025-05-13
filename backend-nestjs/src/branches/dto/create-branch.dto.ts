import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateBranchDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsString()
    location: string;

    @ApiProperty({
        type: Number,
        description: "Required"
    })
    @IsNumber()
    phone: number;

    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsEmail()
    email: string;
    
    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsEmail()
    company: number;

}
