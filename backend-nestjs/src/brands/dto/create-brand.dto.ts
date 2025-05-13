import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({
            type:String,
            description: "Required"
        })
    
    @IsEmpty()
    name: string;
    
    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsEmpty()
    logo: string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsEmpty()
    status : string
}
