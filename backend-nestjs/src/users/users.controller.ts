import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, ConflictException, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2  from 'argon2';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
 
  @Post()
  async create(@Body() createUserDto: CreateUserDto , @Res() res) {
    //return this.usersService.create(createUserDto);

    try {
      const hashedpassword = await argon2.hash(createUserDto.password)
      const bodydata = {...createUserDto, password:hashedpassword}

      const newUser = await this.usersService.create(bodydata)
      return res.status(HttpStatus.CREATED).json({
        message : 'User created Successfuly',
        status : HttpStatus.CREATED,
        data : newUser
      })
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Login already exists');
      }
      
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }
/* @Get('/findUser/:branchId')
  async findUser(@Param('branchId') branchId: number,
                      @Res() res) {
    try {
      const allfind = await this.usersService.findUser(branchId)
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
 */
  @Get('/findByBranch/:branchId')
  async getByBranchId(@Param('branchId') branchId: number,
                      @Res() res) {
    try {
      const allfind = await this.usersService.findByBranchId(branchId)
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

  @Get('/findByStatus/:status')
  async getByStatus(@Param('status') status: string,
                      @Res() res) {
    try {
      const allfind = await this.usersService.findByStatus(status)
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
  @Get('/userByLogin/:login')
  async getUserByLogin(@Param('login') login: string,
                      @Res() res) {
    try {
      const allfind = await this.usersService.findUserByLogin(login)
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
    //return this.usersService.findAll();
    try {
      const allUsers= await this.usersService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"users found successfuly !",
        status:HttpStatus.OK,
        data:allUsers
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
  async findOne(@Param('id') id: number ,@Res() res) {
   try {
    const OneUser = await this.usersService.findOne(+id)
     return res.status(HttpStatus.OK).json({
      message:"One User found successfuly !",
      status:HttpStatus.OK,
      data:OneUser
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
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Res() res) {
    //return this.usersService.update(+id, updateUserDto);
    try {
      if (updateUserDto.password){
         updateUserDto.password = await argon2.hash(updateUserDto.password); 
      }
  
      const updatedata = await this.usersService.update(id,updateUserDto)
      return res.status(HttpStatus.OK).json({
        message:"User updates successfuly !",
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
  async remove(@Param('id') id: number, @Res() res) {
    //return this.usersService.remove(+id);
    try {
      const deletedata = await this.usersService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:"User deleted successfuly !",
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
@Post('userAssign')
async getUsersAssign(
  @Body() body: {   branchId: number, admin: boolean }, 
  @Res() res
) {
   const {  branchId,  admin } = body; 

  try {
    const userTech = await this.usersService.findToAssign( branchId, admin );

    if (userTech.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Aucun technicien trouvé pour cette branche.",
        status: HttpStatus.NOT_FOUND,
        data: null,
      });
    }

    return res.status(HttpStatus.OK).json({
      message: "Techniciens trouvés !",
      status: HttpStatus.OK,
      data: userTech,
    });
  } catch (error) {
    console.error('Erreur backend:', error);  // Log pour examiner l'erreur

    // Si erreur est un objet, vous pouvez renvoyer sa chaîne
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: JSON.stringify(error) || 'Erreur interne du serveur',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
    });
  }
}






  @Get('by-role/:role')
  async getByRole(@Param('role') role: string) {
    return this.usersService.getUsersByRole(role);
  }

  @Get('sorted')
  async getAllSorted() {
    return this.usersService.getAllUsersSortedByRole();
  } 
}
