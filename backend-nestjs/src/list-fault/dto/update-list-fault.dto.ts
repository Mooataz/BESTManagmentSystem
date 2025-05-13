import { PartialType } from '@nestjs/swagger';
import { CreateListFaultDto } from './create-list-fault.dto';

export class UpdateListFaultDto extends PartialType(CreateListFaultDto) {}
