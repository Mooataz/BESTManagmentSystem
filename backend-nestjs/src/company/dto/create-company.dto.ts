import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateCompanyDto {
    @ApiProperty({
            type:String,
            description: "Required"
        })
    @IsString()
    @IsEmpty()
    name!: string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsEmpty()
    headquarterslocation?: string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsString()
    @IsEmpty()
    taxRegisterNumber?: string;

    @ApiProperty({
        type:Number,
        description: "Required"
    })
    @IsNumber()
    @IsEmpty()
    rib?: number;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsEmpty()
    logo?: string;

    @ApiProperty({
        type:String,
        description: "Required"
    })
    @IsEmpty()
    bank? : string;
    
    @ApiProperty({
        type:Number,
        description: "Required"
    })
    quantityAlertStock?: number;

    @ApiProperty({
        type:Number,
        description: "TVA en pourcentage"
    })
    @IsPositive()
    tva?: number;

    @ApiProperty({
        type:Number,
        description: "Timbre fiscale"
    })
    @IsPositive()
    timbreFiscale?: number;
}
