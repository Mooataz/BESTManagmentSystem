import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { Repair } from 'src/repair/entities/repair.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Repair])],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
