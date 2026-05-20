import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { NotesCustomerService } from './notes-customer.service';
import { CreateNotesCustomerDto } from './dto/create-notes-customer.dto';
import { UpdateNotesCustomerDto } from './dto/update-notes-customer.dto';

@Controller('notes-customer')
export class NotesCustomerController {
  constructor(private readonly notesCustomerService: NotesCustomerService) {}

  @Post()
  async create(@Body() createNotesCustomerDto: CreateNotesCustomerDto, 
  @Res() res: any) {
    try {
      const newcreate = await this.notesCustomerService.create(createNotesCustomerDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newcreate
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
      const allfind = await this.notesCustomerService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
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
      const Onefind = await this.notesCustomerService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
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

  @Patch(':id')
  async update(@Param('id') id: number, 
  @Body() updateNotesCustomerDto: UpdateNotesCustomerDto, 
  @Res() res: any) {
    try {
      const updatedata = await this.notesCustomerService.update(+id, updateNotesCustomerDto)
      return res.status(HttpStatus.OK).json({
        message:"Updated Successfuly !",
        status:HttpStatus.OK,
        data:updatedata
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
      const deletedata = await this.notesCustomerService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
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
