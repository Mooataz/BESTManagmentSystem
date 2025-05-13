import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StocKeeperService } from './stoc-keeper.service';
import { CreateStocKeeperDto } from './dto/create-stoc-keeper.dto';
import { UpdateStocKeeperDto } from './dto/update-stoc-keeper.dto';

@Controller('stoc-keeper')
export class StocKeeperController {
  constructor(private readonly stocKeeperService: StocKeeperService) {}

  @Post()
  create(@Body() createStocKeeperDto: CreateStocKeeperDto) {
    return this.stocKeeperService.create(createStocKeeperDto);
  }

  @Get()
  findAll() {
    return this.stocKeeperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stocKeeperService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStocKeeperDto: UpdateStocKeeperDto) {
    return this.stocKeeperService.update(+id, updateStocKeeperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stocKeeperService.remove(+id);
  }
}
