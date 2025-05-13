import { PartialType } from '@nestjs/swagger';
import { CreateLegislationDto } from './create-legislation.dto';

export class UpdateLegislationDto extends PartialType(CreateLegislationDto) {}
