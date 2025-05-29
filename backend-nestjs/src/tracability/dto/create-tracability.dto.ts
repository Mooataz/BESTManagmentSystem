import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmpty, IsString } from "class-validator";

export class CreateTracabilityDto {
  @ApiProperty({ type: Number, nullable: true})
  historyRepair: number;

  @ApiProperty({ type: Number, nullable: true})
  historyStockPart: number;
  
  @ApiProperty({ type: Number, nullable: true})
  user: number;
}
