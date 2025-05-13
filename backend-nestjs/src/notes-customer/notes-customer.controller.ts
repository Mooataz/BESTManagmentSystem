import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { NotesCustomerService } from './notes-customer.service';
import { CreateNotesCustomerDto } from './dto/create-notes-customer.dto';
import { UpdateNotesCustomerDto } from './dto/update-notes-customer.dto';

@Controller('notes-customer')
export class NotesCustomerController {
  constructor(private readonly notesCustomerService: NotesCustomerService) {}

  @Post()
  async create(@Body() createNotesCustomerDto: CreateNotesCustomerDto, 
  @Res() res) {
    try {
      const newcreate = await this.notesCustomerService.create(createNotesCustomerDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newcreate
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
      const allfind = await this.notesCustomerService.findAll()
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

  @Get(':id')
  async findOne(@Param('id') id: number, 
  @Res() res) {
    try {
      const Onefind = await this.notesCustomerService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:Onefind
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
  @Body() updateNotesCustomerDto: UpdateNotesCustomerDto, 
  @Res() res) {
    try {
      const updatedata = await this.notesCustomerService.update(+id, updateNotesCustomerDto)
      return res.status(HttpStatus.OK).json({
        message:"Updated Successfuly !",
        status:HttpStatus.OK,
        data:updatedata
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
      const deletedata = await this.notesCustomerService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
        status:HttpStatus.OK,
        data:deletedata
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
