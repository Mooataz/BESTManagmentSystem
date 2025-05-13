import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateModelDto {
        @ApiProperty({
                type: String,
                description: "Required"
        })
        @IsString()
        @IsNotEmpty()
        name: string;

        @ApiProperty({
                type: String,
                description: "Required"
        })
        @IsNotEmpty()
        picture: string;

        @ApiProperty({
                type: Array ,
                description: "Required" 
        })
        allpartIds: number[] ;
        
}
