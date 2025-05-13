import { PartialType } from '@nestjs/swagger';
import { CreateHistoryStockPartDto } from './create-history-stock-part.dto';

export class UpdateHistoryStockPartDto extends PartialType(CreateHistoryStockPartDto) {}
