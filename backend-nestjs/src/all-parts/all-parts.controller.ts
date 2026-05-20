import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AllPartsService } from './all-parts.service';
import { CreateAllPartDto } from './dto/create-all-part.dto';
import { UpdateAllPartDto } from './dto/update-all-part.dto';

@Controller('all-parts')
export class AllPartsController {
  constructor(private readonly allPartsService: AllPartsService) { }

  @Post()
  async create(@Body() createAllPartDto: CreateAllPartDto,
    @Res() res: any) {
    try {
      const newcreate = await this.allPartsService.create(createAllPartDto)
      return res.status(HttpStatus.CREATED).json({
        message: "created Successfuly !",
        status: HttpStatus.CREATED,
        data: newcreate
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
      const allfind = await this.allPartsService.findAll()
      return res.status(HttpStatus.OK).json({
        message: " founded Successfuly !",
        status: HttpStatus.OK,
        data: allfind
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
      const onefind = await this.allPartsService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message: "One  founded Successfuly !",
        status: HttpStatus.OK,
        data: onefind
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
    @Body() updateAllPartDto: UpdateAllPartDto,
    @Res() res: any) {
    try {
      const updatedata = await this.allPartsService.update(+id, updateAllPartDto)
      return res.status(HttpStatus.OK).json({
        message: " updated Successfuly !",
        status: HttpStatus.OK,
        data: updatedata
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
      const deletedata = await this.allPartsService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message: " deleted Successfuly !",
        status: HttpStatus.OK,
        data: deletedata
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
