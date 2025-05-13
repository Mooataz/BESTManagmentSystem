import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateApproveStockDto {
    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsNotEmpty()
    type : string;

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
    @IsString()
    @IsNotEmpty()
    state : string;

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    idPartRepair: number;
    
}
