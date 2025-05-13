import { PartialType } from '@nestjs/swagger';
import { CreateLevelRepairDto } from './create-level-repair.dto';

export class UpdateLevelRepairDto extends PartialType(CreateLevelRepairDto) {}
