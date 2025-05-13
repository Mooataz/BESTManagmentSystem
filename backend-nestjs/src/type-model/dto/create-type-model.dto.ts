import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateTypeModelDto {
    @ApiProperty({
                    type:String,
                    description: "Required"
                })
    @IsString()
    @IsNotEmpty()
            description : string;
}


