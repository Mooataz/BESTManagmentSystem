import { PartialType } from '@nestjs/swagger';
import { CreatePartsPriceDto } from './create-parts-price.dto';

export class UpdatePartsPriceDto extends PartialType(CreatePartsPriceDto) {}
