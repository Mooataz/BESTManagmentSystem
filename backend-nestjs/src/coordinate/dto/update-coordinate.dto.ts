import { PartialType } from '@nestjs/swagger';
import { CreateCoordinateDto } from './create-coordinate.dto';

export class UpdateCoordinateDto extends PartialType(CreateCoordinateDto) {}
