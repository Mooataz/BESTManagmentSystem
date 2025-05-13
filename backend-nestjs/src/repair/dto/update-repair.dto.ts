import { PartialType } from '@nestjs/swagger';
import { CreateRepairDto } from './create-repair.dto';
import { Repair } from '../entities/repair.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repository } from 'typeorm';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateRepairDto extends PartialType(CreateRepairDto) {

    @IsOptional()
    @IsNumber()
    device?: number;
    @IsOptional()
    @IsNumber()
    user?: number;


}
