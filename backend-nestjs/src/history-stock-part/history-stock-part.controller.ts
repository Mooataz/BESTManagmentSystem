import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { HistoryStockPartService } from './history-stock-part.service';
import { CreateHistoryStockPartDto } from './dto/create-history-stock-part.dto';
import { UpdateHistoryStockPartDto } from './dto/update-history-stock-part.dto';

@Controller('history-stock-part')
export class HistoryStockPartController {
  constructor(private readonly historyStockPartService: HistoryStockPartService) { }

  @Post()
  async create(@Body() createHistoryStockPartDto: CreateHistoryStockPartDto,
    @Res() res) {
    try {
      const newcreate = await this.historyStockPartService.create(createHistoryStockPartDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newcreate})
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null})
    }
  }
  @Get('/find/:stockPartId')
  async getByStockPartId(@Param('stockPartId') stockPartId: number,
    @Res() res) {
    try {
      const allfind = await this.historyStockPartService.findByStockPartId(stockPartId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }
  @Get()
  async findAll(@Res() res) {
    try {
      const allfind = await this.historyStockPartService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number,
    @Res() res) {
    try {
      const Onefind = await this.historyStockPartService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:Onefind
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number,
    @Body() updateHistoryStockPartDto: UpdateHistoryStockPartDto,
    @Res() res) {
    try {
      const updatedata = await this.historyStockPartService.update(+id, updateHistoryStockPartDto)
      return res.status(HttpStatus.OK).json({
        message:"Updated Successfuly !",
        status:HttpStatus.OK,
        data:updatedata
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number,
    @Res() res) {
    try {
      const deletedata = await this.historyStockPartService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
        status:HttpStatus.OK,
        data:deletedata
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }
}
