import { PartialType } from '@nestjs/swagger';
import { CreateApproveStockDto } from './create-approve-stock.dto';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';

export class UpdateApproveStockDto extends PartialType(CreateApproveStockDto) {
    
}
