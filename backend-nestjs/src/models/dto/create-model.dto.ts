import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateModelDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    picture?: string;

    @ApiProperty({ type: [Number] })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    @Transform(({ value }) => value == null ? undefined : Array.isArray(value) ? value.map(Number) : [Number(value)])
    allpartIds?: number[];

    @ApiProperty({ type: Number })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    brand?: number;

    @ApiProperty({ type: Number })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    typeModel?: number; 
}
