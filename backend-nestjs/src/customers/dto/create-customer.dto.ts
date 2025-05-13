import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNumber, IsString } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsEmpty()
    name: string;

    /* @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsEmail()
    @IsEmpty()
    email: string; */
    
    @ApiProperty({
        type:Number,
        description: "Required"
    })
    @IsNumber()
    @IsEmpty()
    phone: number;

    
    

}
