import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { PartsPriceService } from './parts-price.service';
import { CreatePartsPriceDto } from './dto/create-parts-price.dto';
import { UpdatePartsPriceDto } from './dto/update-parts-price.dto';

@Controller('parts-price')
export class PartsPriceController {
  constructor(private readonly partsPriceService: PartsPriceService) { }

  @Post()
  async create(@Body() createPartsPriceDto: CreatePartsPriceDto,
    @Res() res) {
    try {
      const newPrice = await this.partsPriceService.create(createPartsPriceDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Price created Successfuly !",
        status:HttpStatus.CREATED,
        data:newPrice
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
      const allTypes = await this.partsPriceService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Data founded Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
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
      const allTypes = await this.partsPriceService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Data founded Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
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
    @Body() updatePartsPriceDto: UpdatePartsPriceDto,
    @Res() res) {
    try {
      const allTypes = await this.partsPriceService.update(+id, updatePartsPriceDto)
      return res.status(HttpStatus.OK).json({
        message:"Data updated Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
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
      const allTypes = await this.partsPriceService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Data deleted Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }

  @Get(':modelId/:allPartId')
  async findPartsPriceByModelAndAllPart(
                                          @Param('modelId') modelId: number,
                                          @Param('allPartId') allPartId: number,
                                          @Res() res
                                        ) {
 

    try {
      const partsPrice = await this.partsPriceService.findByModelallPArt(
        modelId,
        allPartId,
      );
      return res.status(HttpStatus.OK).json({
        message:`Price Part founded for modelId ${modelId} and allPartId ${allPartId}`,
        status:HttpStatus.OK,
        data:partsPrice
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

