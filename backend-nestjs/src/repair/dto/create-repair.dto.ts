import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsOptional } from "class-validator";
import { type } from "os";

export class CreateRepairDto {

    
    @ApiProperty({ type: String  })
    @IsOptional()
    actuellyBranch: string;

    @ApiProperty({type: Number,})
    @IsNumber()
    @IsOptional()
    customer: number;
    
    @ApiProperty({ type: Number,})
    @IsNumber()
    @IsOptional()   
    device: number;

    @ApiProperty({ type: String   })
    @IsOptional()
    remark: string;

    @ApiProperty({ type: String  })
    deviceStateReceive: string;

    @ApiProperty({ type: Array   })
    @IsOptional()
    accessoryIds: number[];

    @ApiProperty({ type: [Number], required: true })
    @IsArray()
    @IsNumber({}, { each: true })
    listFaultIds: number[];

    @ApiProperty({ type: Array  })
    @IsOptional()
    customerRequestIds: number[];

   /*  @ApiProperty({ type: Array  })
    @IsOptional()
    notesCustomerIds: number[];

    @ApiProperty({ type: Array })
    @IsOptional()
    expertiseReasonsIds: number[];

    @ApiProperty({ type: Array  })
    @IsOptional()
    repairActionIds: number[]; */

       /*  @ApiProperty({ type: Boolean   })
    @IsBoolean()
    @IsOptional()
    warrenty: boolean;

    @ApiProperty({type: Boolean })
    @IsBoolean()
    @IsOptional()
    approveRepair: boolean;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsOptional()
    files: string[]; */

    /* @ApiProperty({type: Number,})
    @IsNumber()
    @IsOptional()
    newSerialNumber: string;

    @ApiProperty({type: Number })
    @IsOptional()
    advancePayment: number; */

   /*  @ApiProperty({type: Number,})
    @IsOptional()
    user: number; */

     /*  @ApiProperty({ type: [Number]  })
    @IsArray()
    @IsNumber({}, { each: true})
    @IsOptional()
    partsNeed: number[];  */

    
}
