import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAccessoryDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsString()
    name: string;
    
}
