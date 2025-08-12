import { PartialType } from '@nestjs/swagger';
import { CreateRepairDto } from './create-repair.dto';
import { Repair } from '../entities/repair.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repository } from 'typeorm';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateRepairDto extends PartialType(CreateRepairDto) {

  @IsOptional()
  @IsNumber()
  device?: number;

  @IsOptional()
  @IsNumber()
  user?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  accessoryIds?: number[];


  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  listFaultIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  customerRequestIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  notesCustomer?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  expertiseReason?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  repairAction?: number[];
}
