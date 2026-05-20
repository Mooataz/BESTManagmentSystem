import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Res, HttpStatus, UploadedFile, HttpException } from '@nestjs/common';
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
    @Res() res: any ,
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

  @Get('/findByBrand/:brandId')
  async getByBrand(@Param('brandId') brandId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.modelsService.findByBrandId(brandId)
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

  @Get('/findByBrand/:typeModelId')
  async getByTypeModelId(@Param('typeModelId') typeModelId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.modelsService.findByTypeModelId(typeModelId)
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

    @Get('findByBrandAuthorised')
  async findByBrandAuthorised (@Res() res: any) {
    
    try {
       
      const  data = await this.modelsService.findByBrandAuthorised();
      return res.status(HttpStatus.OK).json({
        message: "Get Authorised Model successfuly !",
        status: HttpStatus.OK,
        data: data
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
      const comp = await this.modelsService.findAll()
      return res.status(HttpStatus.OK).json({
        message: "Models found successfuly !",
        status: HttpStatus.OK,
        data: comp
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
      const oneCompany = await this.modelsService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message: "One model found successfuly !",
        status: HttpStatus.OK,
        data: oneCompany
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
    @Res() res: any,
    @UploadedFile() picture: Express.Multer.File) {

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
      const deletedata = await this.modelsService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message: "Model deleted successfuly !",
        status: HttpStatus.OK,
        data: deletedata
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
