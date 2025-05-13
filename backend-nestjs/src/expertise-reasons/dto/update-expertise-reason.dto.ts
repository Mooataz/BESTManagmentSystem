import { PartialType } from '@nestjs/swagger';
import { CreateExpertiseReasonDto } from './create-expertise-reason.dto';

export class UpdateExpertiseReasonDto extends PartialType(CreateExpertiseReasonDto) {}
