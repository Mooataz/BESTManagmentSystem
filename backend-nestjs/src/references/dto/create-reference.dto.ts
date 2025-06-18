import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReferenceDto {
    @ApiProperty({
        type: String,
        description: "Required"
    })
    
    @IsNotEmpty()
    materialCode: string;

    @ApiProperty({
        type: String,
        description: "Required"
    })
    @IsOptional()
    description: string;

    @ApiProperty({
        type: Array,
        description: "Required"
    })
    modelIds: number[];
    
    @ApiProperty({
        type: Number,
        description: "Required"
    })
    allpart: number;
    
}
