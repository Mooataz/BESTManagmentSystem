import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmpty, IsString } from "class-validator";

export class CreateTracabilityDto {
  @ApiProperty({ type: Number})
  historyRepair: number;

  @ApiProperty({ type: Number})
  historyStockPart: number;
  
  @ApiProperty({ type: Number})
  user: number;
}
