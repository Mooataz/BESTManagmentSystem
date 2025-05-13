import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, ConflictException } from '@nestjs/common';
import { BinService } from './bin.service';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';

@Controller('bin')
export class BinController {
  constructor(private readonly binService: BinService) { }

  @Post()
  async create(@Body() createBinDto: CreateBinDto,
    @Res() res) {
    try {
      const newCreate = await this.binService.create(createBinDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newCreate
      })
    } catch (error) {
      if (error.code === '23505') {
              throw new ConflictException('Bin already exists');
            }
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }
  @Get('/find/:branchId')
  async getByBranchId(@Param('branchId') branchId: number,
    @Res() res) {
    try {
      const allfind = await this.binService.findByBranchId(branchId)
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

  @Get('/find/:branchId/:type')
  async getByBranchIdAndType( @Param('branchId') branchId: number,
                              @Param('type') type: string,
                              @Res() res) {
    try {
      const allfind = await this.binService.findByBranchIdAndType(branchId, type)
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
      const allfind = await this.binService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Types founded Successfuly !",
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
      const onefind = await this.binService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"founded Successfuly !",
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
    @Body() updateBinDto: UpdateBinDto,
    @Res() res) {
    try {
      const updateType = await this.binService.update(+id, updateBinDto)
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
      const deleteType = await this.binService.remove(+id)
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
}
