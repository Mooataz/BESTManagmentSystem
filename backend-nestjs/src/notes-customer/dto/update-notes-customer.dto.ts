import { PartialType } from '@nestjs/swagger';
import { CreateNotesCustomerDto } from './create-notes-customer.dto';

export class UpdateNotesCustomerDto extends PartialType(CreateNotesCustomerDto) {}
