import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateListFaultDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
