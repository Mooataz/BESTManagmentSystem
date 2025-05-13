import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";



export class CreateNotificationDto{
    @ApiProperty({ type: String, description: "Required"})
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ type: String, description: "Required"})
    @IsString()
    @IsNotEmpty()
    body: string;
}