import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { OutputListService } from './output-list.service';
import { CreateOutputListDto } from './dto/create-output-list.dto';
import { UpdateOutputListDto } from './dto/update-output-list.dto';

@Controller('output-list')
export class OutputListController {
  constructor(private readonly outputListService: OutputListService) { }

  @Post()
  async create(@Body() createOutputListDto: CreateOutputListDto,
    @Res() res: any) {
    try {
      const newcreate = await this.outputListService.create(createOutputListDto)
      return res.status(HttpStatus.CREATED).json({
        message : 'created Successfuly',
        status : HttpStatus.CREATED,
        data : newcreate
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
      const allfind= await this.outputListService.findAll()
      return res.status(HttpStatus.OK).json({
        message:" found successfuly !",
        status:HttpStatus.OK,
        data:allfind
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
      const Onefind = await this.outputListService.findOne(+id)
       return res.status(HttpStatus.OK).json({
        message:"One found successfuly !",
        status:HttpStatus.OK,
        data:Onefind
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
  @Get('/findByBranch/:branchId')
  async getByBranchId(@Param('branchId') branchId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.outputListService.findByBranchId(branchId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
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

  @Get('/findByCustomer/:customerId')
  async getByCustomerId(@Param('customerId') customerId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.outputListService.findByCustomerId(customerId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
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
      const deletedata = await this.outputListService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:" deleted successfuly !",
        status:HttpStatus.OK,
        data:deletedata
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
