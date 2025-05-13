import { PartialType } from '@nestjs/swagger';
import { CreateBinDto } from './create-bin.dto';

export class UpdateBinDto extends PartialType(CreateBinDto) {}
