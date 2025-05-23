import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Res, HttpStatus, UploadedFile } from '@nestjs/common';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) { }
   @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: "string" },
        picture: { type: "string", format: "binary" },
        typeModel: { type: "number" },
        brand: { type: "number" },
        allpartIds: {
          type: "array",
          items: { type: 'number', },
        }
      }
    }

  }) 
  @ApiConsumes("multipart/form-data")

   @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: "./upload/models",
        filename: (_request, picture, callback) =>
          callback(null, `${new Date().getTime()}-${picture.originalname}`)
      })
    })
  ) 
  @Post()
  async create(@Body() createModelDto: CreateModelDto,
    @Res() res ,
     @UploadedFile() picture: Express.Multer.File  ) {
    try {
     
        createModelDto.picture = picture.filename 
        if (typeof createModelDto.allpartIds === 'string') {
  createModelDto.allpartIds = JSON.parse(createModelDto.allpartIds);
}
      const newUser = await this.modelsService.create(createModelDto)
      return res.status(HttpStatus.CREATED).json({
        message: "Model created Successfuly !",
        status: HttpStatus.CREATED,
        data: newUser
      })

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Get('/findByBrand/:brandId')
  async getBySaleId(@Param('brandId') brandId: number,
                      @Res() res) {
    try {
      const allfind = await this.modelsService.findByBrandId(brandId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null }) }
  }

  @Get('/findByBrand/:typeModelId')
  async getByTypeModelId(@Param('typeModelId') typeModelId: number,
                      @Res() res) {
    try {
      const allfind = await this.modelsService.findByTypeModelId(typeModelId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null }) }
  }
  @Get()
  async findAll(@Res() res) {

    try {
      const comp = await this.modelsService.findAll()
      return res.status(HttpStatus.OK).json({
        message: "Models found successfuly !",
        status: HttpStatus.OK,
        data: comp
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })

    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number,
    @Res() res) {

    try {
      const oneCompany = await this.modelsService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message: "One model found successfuly !",
        status: HttpStatus.OK,
        data: oneCompany
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: "string" },
        picture: { type: "string", format: "binary" },
        brand: { type: "number" },
        typeModel: { type: "number" },

      }
    }

  })
  @ApiConsumes("multipart/form-data")

  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: "./upload/models",
        filename: (_request, picture, callback) =>
          callback(null, `${new Date().getTime()}-${picture.originalname}`)
      })
    })
  )
  @Patch(':id')
  async update(@Param('id') id: number,
    @Body() body:any,
    @Res() res,
    @UploadedFile() picture: Express.Multer.File) {

    // return this.modelsService.update(+id, updateModelDto);
    try {
      const updateModelDto = new UpdateModelDto();
      updateModelDto.name = body.name;
    // Handle picture update
    if (picture) {
      updateModelDto.picture = picture.filename;
    } else if (body.picture) {
      updateModelDto.picture = body.picture;
    }
     // Handle allparts
    if (body.allpartIds) {
      updateModelDto.allpartIds = Array.isArray(body.allpartIds) 
        ? body.allpartIds 
        : JSON.parse(body.allpartIds);
    }

    if (body.brand) updateModelDto.brand = parseInt(body.brand);
    if (body.typeModel) updateModelDto.typeModel = parseInt(body.typeModel);

      const updatedata = await this.modelsService.update(id, updateModelDto)
      return res.status(HttpStatus.OK).json({
        message: "Model updated successfuly !",
        status: HttpStatus.OK,
        data: updatedata
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number,
    @Res() res) {

    try {
      const deletedata = await this.modelsService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message: "Model deleted successfuly !",
        status: HttpStatus.OK,
        data: deletedata
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })

    }
  }
}
