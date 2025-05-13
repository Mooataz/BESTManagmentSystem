import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNumber } from "class-validator";

export class CreateDeviceDto {
    @ApiProperty({
            type:String,
            description: "Required"
        })
    serialeNumber? : string;

    @ApiProperty({
        type:Date,
        description: "Required"
    })
    purchaseDate? : Date ;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    warrentyProof? : string;
    @ApiProperty({
        type: [Number],
        description: "Array of part IDs (Required, send as '1,2,3')",
        example: [1, 2, 3],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    customer: number[];
   
}
