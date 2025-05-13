import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateLoginDTO{
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
}