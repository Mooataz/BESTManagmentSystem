import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CreateStockPartDto {
    @ApiProperty({
        type:String,
        description: "Required"
    })
    serialNumber : string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    remark : string;
  
     
}

