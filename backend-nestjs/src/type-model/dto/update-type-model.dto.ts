import { PartialType } from '@nestjs/swagger';
import { CreateTypeModelDto } from './create-type-model.dto';

export class UpdateTypeModelDto extends PartialType(CreateTypeModelDto) {}
