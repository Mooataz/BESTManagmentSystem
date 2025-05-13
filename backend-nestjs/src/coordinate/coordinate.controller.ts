import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoordinateService } from './coordinate.service';
import { CreateCoordinateDto } from './dto/create-coordinate.dto';
import { UpdateCoordinateDto } from './dto/update-coordinate.dto';

@Controller('coordinate')
export class CoordinateController {
  constructor(private readonly coordinateService: CoordinateService) {}

  @Post()
  create(@Body() createCoordinateDto: CreateCoordinateDto) {
    return this.coordinateService.create(createCoordinateDto);
  }

  @Get()
  findAll() {
    return this.coordinateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordinateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoordinateDto: UpdateCoordinateDto) {
    return this.coordinateService.update(+id, updateCoordinateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordinateService.remove(+id);
  }
}
