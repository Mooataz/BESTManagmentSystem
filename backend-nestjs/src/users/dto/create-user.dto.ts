import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEmail, IsEmpty, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Branch } from "src/branches/entities/branch.entity";
import { Repair } from "src/repair/entities/repair.entity";
import { ManyToMany } from "typeorm";

export class CreateUserDto {

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsNotEmpty()
    name : string;

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    @IsNumber()
    @IsNotEmpty()
    phone : number;

    /* @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsEmail()
    email : string; */

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsNotEmpty()
    login : string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsNotEmpty()
    password : string;

    @ApiProperty({
        type:Date,
        description: "Required"
    })
    @IsDate()
    @IsNotEmpty()
    createdDate : Date;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsNotEmpty()
    status : string;
    
    @ApiProperty({
        type:[String],
        description: "Required"
    })
    @IsArray()
    @IsString({ each: true })
    role : string;

    @ApiProperty({
        type:Array,
        description: "Required"
    })
    permissionsIds: number[];

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    @IsNumber()
    @IsNotEmpty()
    branch?: number; 
}
