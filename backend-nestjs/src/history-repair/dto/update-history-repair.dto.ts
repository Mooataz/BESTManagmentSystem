import { PartialType } from '@nestjs/swagger';
import { CreateHistoryRepairDto } from './create-history-repair.dto';

export class UpdateHistoryRepairDto extends PartialType(CreateHistoryRepairDto) {}
