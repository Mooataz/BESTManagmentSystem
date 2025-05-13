import { PartialType } from '@nestjs/swagger';
import { CreateOutputListDto } from './create-output-list.dto';

export class UpdateOutputListDto extends PartialType(CreateOutputListDto) {}
