import { PartialType } from '@nestjs/swagger';
import { CreateRepairActionDto } from './create-repair-action.dto';

export class UpdateRepairActionDto extends PartialType(CreateRepairActionDto) {}
