import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty } from "class-validator";

export class CreateOutputListDto {
    @ApiProperty({
        type:Date,
        description: "Required"
    })
    @IsDate()
    @IsNotEmpty()
    date : Date;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    remark : string;

    @ApiProperty({
        type: Array,
        description: "Required"
    })
    repairIds: number[]; 

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    customer: number;

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    user: number;
}
