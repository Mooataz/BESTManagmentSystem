import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, ParseArrayPipe, ParseIntPipe, HttpException } from '@nestjs/common';
import { StockPartsService } from './stock-parts.service';
import { CreateStockPartDto } from './dto/create-stock-part.dto';
import { UpdateStockPartDto } from './dto/update-stock-part.dto';

@Controller('stock-parts')
export class StockPartsController {
  constructor(private readonly stockPartsService: StockPartsService) { }

  @Post()
  async create(@Body() /* createStockPartDto: CreateStockPartDto */ data:any,
    @Res() res: any) {
    try {
       const {userId, ...createStockPartDto} = data; 
      const newCreate = await this.stockPartsService.create(createStockPartDto, userId)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newCreate
      })
    }   catch (error) {
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
      const allfind = await this.stockPartsService.findAll()
      return res.status(HttpStatus.OK).json({
        message:" founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind
      })
    }   catch (error) {
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
      const onefind = await this.stockPartsService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:" founded Successfuly !",
        status:HttpStatus.OK,
        data:onefind
      })
    }   catch (error) {
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
    @Body() updateStockPartDto: UpdateStockPartDto,
    @Res() res: any) {
    try {
      const updateType = await this.stockPartsService.update(+id, updateStockPartDto)
      return res.status(HttpStatus.OK).json({
        message:"updated Successfuly !",
        status:HttpStatus.OK,
        data:updateType
      })
    }   catch (error) {
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
      const deleteType = await this.stockPartsService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
        status:HttpStatus.OK,
        data:deleteType
      })
    }   catch (error) {
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
  @Get('/findBranch/:branchId')
  async getByBinId(@Param('branchId') branchId: number,
    @Res() res: any) {
    try {
      const allfind = await this.stockPartsService.findByBranchId(branchId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind
      })
    }   catch (error) {
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
    
  @Get('filter/:references/:bin')
  async filterStockParts(
    @Param('references', new ParseArrayPipe({ items: Number, separator: ',' })) references: number[],
    @Param('bin') binType: number,
    @Res() res: any
  ) {
    try {
      const result = await this.stockPartsService.filterByReferenceAndBin(
        references, binType );

      return res.status(HttpStatus.OK).json({
        message: 'Found successfully!',
        status: HttpStatus.OK,
        data: result,
      });
    }  catch (error) {
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

  @Get('/find/:type/:branchId')
  async getByBinType(@Param('type') type: string,@Param('branchId') branchId: number,
    @Res() res: any) {
    try {
      const allfind = await this.stockPartsService.findByBinType(type, branchId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind
      })
    }   catch (error) {
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
  
 


    @Get('AddHistorytockPart/:id/:userId/:step')
  async AddHistorytockPart (@Param('id') id: number, @Param('userId') userId: number, @Param('step') step: string, @Res() res: any) {
    try {
      const allfind = await this.stockPartsService.AddHistorytockPart(id, userId, step)

      return res.status(HttpStatus.OK).json({
        message:"Updated Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
    }   catch (error) {
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
