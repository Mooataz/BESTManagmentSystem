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
    warrentyProof : string;
   
 
   
}
