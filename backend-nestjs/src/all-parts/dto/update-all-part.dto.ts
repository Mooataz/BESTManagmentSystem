import { PartialType } from '@nestjs/swagger';
import { CreateAllPartDto } from './create-all-part.dto';

export class UpdateAllPartDto extends PartialType(CreateAllPartDto) {}
