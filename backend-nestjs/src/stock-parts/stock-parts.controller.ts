import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, ParseArrayPipe, ParseIntPipe } from '@nestjs/common';
import { StockPartsService } from './stock-parts.service';
import { CreateStockPartDto } from './dto/create-stock-part.dto';
import { UpdateStockPartDto } from './dto/update-stock-part.dto';

@Controller('stock-parts')
export class StockPartsController {
  constructor(private readonly stockPartsService: StockPartsService) { }

  @Post()
  async create(@Body() createStockPartDto: CreateStockPartDto,
    @Res() res) {
    try {
      const newCreate = await this.stockPartsService.create(createStockPartDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newCreate
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
      const allfind = await this.stockPartsService.findAll()
      return res.status(HttpStatus.OK).json({
        message:" founded Successfuly !",
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
      const onefind = await this.stockPartsService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:" founded Successfuly !",
        status:HttpStatus.OK,
        data:onefind
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
    @Body() updateStockPartDto: UpdateStockPartDto,
    @Res() res) {
    try {
      const updateType = await this.stockPartsService.update(+id, updateStockPartDto)
      return res.status(HttpStatus.OK).json({
        message:"updated Successfuly !",
        status:HttpStatus.OK,
        data:updateType
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
      const deleteType = await this.stockPartsService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
        status:HttpStatus.OK,
        data:deleteType
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }
  @Get('/find/:binId')
  async getByBinId(@Param('binId') binId: number,
    @Res() res) {
    try {
      const allfind = await this.stockPartsService.findByBinId(binId)
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
    
  @Get('filter/:references/:bin')
  async filterStockParts(
    @Param('references', new ParseArrayPipe({ items: Number, separator: ',' })) references: number[],
    @Param('bin') binType: number,
    @Res() res
  ) {
    try {
      const result = await this.stockPartsService.filterByReferenceAndBin(
        references, binType );

      return res.status(HttpStatus.OK).json({
        message: 'Found successfully!',
        status: HttpStatus.OK,
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null,
      });
    }
  }

  @Get('/find/:type/:branchId')
  async getByBinType(@Param('type') type: string,@Param('branchId') branchId: number,
    @Res() res) {
    try {
      const allfind = await this.stockPartsService.findByBinType(type, branchId)
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
  
  @Get('stateStock')
  async getStateStock ( @Res() res){
    try {
      const allfind = await this.stockPartsService.stateStock()
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }
}
