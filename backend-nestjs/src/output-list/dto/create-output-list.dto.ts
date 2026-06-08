import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateOutputListDto {
    @ApiProperty({
        type:Date,
        description: "Required"
    })
    @IsDateString()
    @IsNotEmpty()
    date? : string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsOptional()
    remark? : string;

    @ApiProperty({
        type: Array,
        description: "Required"
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    repairIds?: number[]; 

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    @IsOptional()
    @IsNumber()
    customer?: number;

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    @IsNumber()
    user!: number;
}
