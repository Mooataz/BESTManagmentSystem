import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { PartsPriceService } from './parts-price.service';
import { CreatePartsPriceDto } from './dto/create-parts-price.dto';
import { UpdatePartsPriceDto } from './dto/update-parts-price.dto';

@Controller('parts-price')
export class PartsPriceController {
  constructor(private readonly partsPriceService: PartsPriceService) { }

  @Post()
  async create(@Body() createPartsPriceDto: CreatePartsPriceDto,
    @Res() res: any) {
    try {
      const newPrice = await this.partsPriceService.create(createPartsPriceDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Price created Successfuly !",
        status:HttpStatus.CREATED,
        data:newPrice
      })
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        })
      }
    
      throw error
    }
  }

  @Get()
  async findAll(@Res() res: any) {
    
    try {
      const allTypes = await this.partsPriceService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Data founded Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
      })
    } catch (error) {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }

  @Get(':id')
  async findOne(@Param('id') id: number,
    @Res() res: any) {
    try {
      const allTypes = await this.partsPriceService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Data founded Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
      })
    } catch (error) {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }

  @Patch(':id')
  async update(@Param('id') id: number,
    @Body() updatePartsPriceDto: UpdatePartsPriceDto,
    @Res() res: any) {
    try {
      const allTypes = await this.partsPriceService.update(+id, updatePartsPriceDto)
      return res.status(HttpStatus.OK).json({
        message:"Data updated Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
      })
    } catch (error) {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }

  @Delete(':id')
  async remove(@Param('id') id: number,
    @Res() res: any) {
    
    try {
      const allTypes = await this.partsPriceService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Data deleted Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
      })
    } catch (error) {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }

  @Get(':modelId/:allPartId')
  async findPartsPriceByModelAndAllPart(
                                          @Param('modelId') modelId: number,
                                          @Param('allPartId') allPartId: number,
                                          @Res() res: any
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
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }
}

