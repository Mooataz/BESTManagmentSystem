import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty } from "class-validator";

export class CreateTransfertDto {
    @ApiProperty({
                type:String,
                description: "Required"
            })
        
     delivredBy : string;
    
    
    @ApiProperty({
        type:Date,
        description: "Required"
    })
    sendingDate: Date ;
    
    @ApiProperty({
        type:Date,
        description: "Required"
    })

    @Optional()
    receivedDate : Date ;
    
    @ApiProperty({
        type:String,
        description: "Required"
    })
    type : string;
   
    
    @ApiProperty({
        type:String,
        description: "Required"
    })
    state : string;
    
    @ApiProperty({
        type:String,
        description: "Required"
    })
    remark : string;

    @ApiProperty({
        type:Array,
        description: "Required"
    })
    repairIds: number[];

    @ApiProperty({ type:Array, description: "Required"})
    stockPartIds: number[];

    @ApiProperty({ type:Number, description: "Required"})
    toBranch: number;
}
