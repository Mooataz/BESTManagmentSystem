import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDistributeurDto {
    @ApiProperty({
            type:String,
            description: "Required"
        })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    @IsNumber()
    @IsEmpty()
    phone : number;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsEmail()
    @IsEmpty()
    email: string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsEmpty()
    location: string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsEmpty()
    taxRegisterNumber: string;
}
