import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLoginDTO } from './dto/create-login.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
type JwtPayload = { sub: number,
  login: string
  }
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              
  ) {}

  @Post('signIn')
  sigIn(@Body() createLoginDTO: CreateLoginDTO){
    return this.authService.signIn(createLoginDTO)
  }
  
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout (@Req() req: Request){
    const user = req.user as JwtPayload;
    const userId = user.sub
    return this.authService.logout(userId);
  }
 
  
  @ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Get('me')
getMe(@Req() req: Request) {
  const user = req.user as JwtPayload;
  return this.authService.findUserById(user.sub); 
}

  @UseGuards(AccessTokenGuard)
  @Patch('password/:userId')
  @ApiBody({
    description: 'Change user password',
    type: Object,
    schema: {
      type: 'object',
      properties: {
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
      required: ['currentPassword', 'newPassword'],
    },
  })
  async updatePassword (  @Param('userId') userId: number, 
                          @Body() passwordDTO:{currentPassword: string; newPassword: string},
                          @Res() res){
 try {
      const updateType = await this.authService.updatePassword(userId, passwordDTO.currentPassword, passwordDTO.newPassword)
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
}
