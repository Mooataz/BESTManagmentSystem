import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateModelDto } from './create-model.dto';
import { TypeModel } from 'src/type-model/entities/type-model.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateModelDto extends PartialType(CreateModelDto) {
   
}
