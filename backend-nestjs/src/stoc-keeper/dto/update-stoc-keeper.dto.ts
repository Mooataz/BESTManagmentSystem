import { PartialType } from '@nestjs/swagger';
import { CreateStocKeeperDto } from './create-stoc-keeper.dto';

export class UpdateStocKeeperDto extends PartialType(CreateStocKeeperDto) {}
