import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto, 
  @Res() res: any) {
    try {
      const newcreate = await this.salesService.create(createSaleDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newcreate
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

  @Get('/findByBranch/:branchId')
  async getByBranchId(@Param('branchId') branchId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.salesService.findByBranchId(branchId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
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

  @Get('/findByUser/:userId')
  async getByUserId(@Param('userId') userId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.salesService.findByUserId(userId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
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

  @Get('/findByState/:state')
  async getByState(@Param('state') state: string,
                      @Res() res: any) {
    try {
      const allfind = await this.salesService.findByState(state)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
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
  @Get()
  async findAll(@Res() res: any) {
    try {
      const allfind = await this.salesService.findAll()
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

  @Get(':id')
  async findOne(@Param('id') id: number, 
  @Res() res: any) {
    try {
      const Onefind = await this.salesService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:Onefind
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
  async update(@Param('id') id: string, 
  @Body() updateSaleDto: UpdateSaleDto, 
  @Res() res: any) {
    try {
      const updatedata = await this.salesService.update(+id, updateSaleDto)
      return res.status(HttpStatus.OK).json({
        message:"Updated Successfuly !",
        status:HttpStatus.OK,
        data:updatedata
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
      const deletedata = await this.salesService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
        status:HttpStatus.OK,
        data:deletedata
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
}
