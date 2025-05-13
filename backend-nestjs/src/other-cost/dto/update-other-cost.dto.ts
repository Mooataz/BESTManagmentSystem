import { PartialType } from '@nestjs/swagger';
import { CreateOtherCostDto } from './create-other-cost.dto';

export class UpdateOtherCostDto extends PartialType(CreateOtherCostDto) {}
