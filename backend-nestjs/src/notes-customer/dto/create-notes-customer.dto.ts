import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotesCustomerDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
