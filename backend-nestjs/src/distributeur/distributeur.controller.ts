import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, HttpException } from '@nestjs/common';
import { DistributeurService } from './distributeur.service';
import { CreateDistributeurDto } from './dto/create-distributeur.dto';
import { UpdateDistributeurDto } from './dto/update-distributeur.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('distributeur')
export class DistributeurController {
  constructor(private readonly distributeurService: DistributeurService) {}
 

  @Post()
  async create(@Body() createDistributeurDto: CreateDistributeurDto, @Res() res: any) {
    
    try {
      const newDistributeur = await this.distributeurService.create(createDistributeurDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Distributer created Successfuly !",
        status:HttpStatus.CREATED,
        data:newDistributeur
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
  async findAll( @Res() res: any) {
    try {
      const allDistributeurs = await this.distributeurService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Distributers found Successfuly !",
        status:HttpStatus.OK,
        data:allDistributeurs
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
  async findOne(@Param('id') id: number ,@Res() res: any) {
    try {
      const OneDistributeur = await this.distributeurService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Distributeur found Successfuly !",
        status:HttpStatus.OK,
        data:OneDistributeur
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
  async update(@Param('id') id: number, @Body() updateDistributeurDto: UpdateDistributeurDto,  @Res() res: any) {
    try {
      const updatedata = await this.distributeurService.update(id,updateDistributeurDto)
      return res.status(HttpStatus.OK).json({
        message:"Distributeur updated Successfuly !",
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
  async remove(@Param('id') id: number,  @Res() res: any) {
    try {
      const deletedata = await this.distributeurService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Distributeur deleted Successfuly !",
        status:HttpStatus.OK,
        data:deletedata
      })
    }catch (error) {
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
