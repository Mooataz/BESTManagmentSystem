import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber } from "class-validator";
import { type } from "os";

export class CreateRepairDto {
    @ApiProperty({ type: Boolean, description: "Required" })
    @IsBoolean()
    warrenty?: boolean;

    @ApiProperty({type: Boolean, description: "Required" })
    @IsBoolean()
    approveRepair?: boolean;

    @ApiProperty({ type: [String],description: "Required"})
    @IsArray()
    files?: string[];

    @ApiProperty({type: Number,})
    @IsNumber()
    newSerialNumber?: string;

    @ApiProperty({type: Number, description: "Required"})
    advancePayment?: number;
    
    @ApiProperty({ type: Number, description: "Required" })
    actuellyBranch: number;
    
    @ApiProperty({ type: [Number], description: "Required" })
    @IsArray()
    @IsNumber({}, { each: true})
    partsNeed?: number[]; 

    @ApiProperty({ type: String, description: "Required"  })
    remark?: string;

    @ApiProperty({ type: String, description: "Required" })
    deviceStateReceive?: string;

    @ApiProperty({ type: Array, description: "Required"  })
    accessoryIds: number[];

    @ApiProperty({ type: Array, description: "Required" })
    listFaultIds: number[];

    @ApiProperty({ type: Array, description: "Required" })
    customerRequestIds: number[];

    @ApiProperty({ type: Array, description: "Required" })
    notesCustomerIds: number[];

    @ApiProperty({ type: Array, description: "Required" })
    expertiseReasonsIds: number[];

    @ApiProperty({ type: Array, description: "Required" })
    repairActionIds: number[];

    @ApiProperty({ type: Number,})   
    device: number;

    @ApiProperty({type: Number,})
    user: number;
}
