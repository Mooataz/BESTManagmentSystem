import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, ConflictException, HttpException } from '@nestjs/common';
import { BinService } from './bin.service';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';

@Controller('bin')
export class BinController {
  constructor(private readonly binService: BinService) { }

  @Post()
  async create(@Body() createBinDto: CreateBinDto,
    @Res() res:any) {
    try {
      const newCreate = await this.binService.create(createBinDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newCreate
      })
    } catch (error) {
    
    if (error instanceof HttpException) {
      if (error.name === '23505') {
              throw new ConflictException('Case déja utilisé');
            }
      return res.status(error.getStatus()).json({
        message: error.message,
        status: error.getStatus(),
        data: null,
      })
    }
  
    throw error
  }
  }



  @Get('/find/:branchId')
  async getByBranchId(@Param('branchId') branchId: number,
    @Res() res: any) {
    try {
      const allfind = await this.binService.findByBranchId(branchId)
       
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
 @Get('/findName/:name')
  async getByName(@Param('name') name: string,
    @Res() res: any) {
    try {
      const allfind = await this.binService.findByName(name)
       
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
  @Get('/find/:branchId/:type')
  async getByBranchIdAndType( @Param('branchId') branchId: number,
                              @Param('type') type: string,
                              @Res() res: any) {
    try {
      const allfind = await this.binService.findByBranchIdAndType(branchId, type)
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
  @Get()
  async findAll(@Res() res: any) {
    try {
      const allfind = await this.binService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Types founded Successfuly !",
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
      const onefind = await this.binService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"founded Successfuly !",
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
    @Body() updateBinDto: UpdateBinDto,
    @Res() res: any) {
    try {
      const updateType = await this.binService.update(+id, updateBinDto)
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
      const deleteType = await this.binService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
        status:HttpStatus.OK,
        data:deleteType
      })
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
}
