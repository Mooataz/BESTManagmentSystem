import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLoginDTO } from './dto/create-login.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

type JwtPayload = { sub: number,
  login: string
  }
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private configService: ConfigService
              
  ) {}

  @Post('signIn')
  async sigIn(@Body() createLoginDTO: CreateLoginDTO,
  @Res({ passthrough: true }) res: Response){
     const { user, token } = await this.authService.signIn(createLoginDTO);
  
 // AuthController - signIn
res.cookie('access_token', token.accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // Plus flexible que 'strict'
  maxAge: 24 * 60 * 60 * 1000, // 1 jour
  path: '/',
  domain: 'localhost' // Spécifiez en développement
});

  return { user };
  
    }
  
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout (@Req() req: Request){
    const user = req.user as JwtPayload;
    const userId = user.sub
    return this.authService.logout(userId);
  }

  @Get('id')
 async getUserId(@Param('id') id: number, @Res() res){

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
