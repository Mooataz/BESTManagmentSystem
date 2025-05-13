import { PartialType } from '@nestjs/mapped-types';
import { CreateDistributeurDto } from './create-distributeur.dto';

export class UpdateDistributeurDto extends PartialType(CreateDistributeurDto) {}
