import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsNotEmpty()
    name! : string;

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    @IsNumber()
    @IsNotEmpty()
    phone! : number;

   

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsNotEmpty()
    login! : string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsNotEmpty()
    password! : string;

    @ApiProperty({
        type:Date,
        description: "Required"
    })
    @IsDateString()
    @IsNotEmpty()
    createdDate! : string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsNotEmpty()
    status! : string;
    
    @ApiProperty({
        type:[String],
        description: "Required"
    })
    @IsArray()
    @IsString({ each: true })
    role! : string[];

 

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    @IsNumber()
    branch?: number; 
}
