import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePermissionDto {
       @ApiProperty({
                type:String,
                description: "Required"
            })
        @IsString()
        description : string;
}
