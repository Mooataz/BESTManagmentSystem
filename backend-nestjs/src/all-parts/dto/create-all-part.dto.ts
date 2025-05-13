import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAllPartDto {
    @ApiProperty({
                    type:String,
                    description: "Required"
                })
    @IsString()
            description : string;
}
