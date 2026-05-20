import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNumber } from "class-validator";

export class CreateDeviceDto {
  @ApiProperty({
    type: String,
    description: "Required"
  })
  serialenumber!: string; // ✅ Match the entity name

  @ApiProperty({
    type: Date,
    description: "Required"
  })
  purchaseDate!: Date;

}