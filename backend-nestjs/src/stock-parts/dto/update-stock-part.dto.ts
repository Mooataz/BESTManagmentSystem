import { PartialType } from '@nestjs/swagger';
import { CreateStockPartDto } from './create-stock-part.dto';

export class UpdateStockPartDto extends PartialType(CreateStockPartDto) {}
