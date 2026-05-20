import { Controller, Get, Param, Query, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('apiApp')
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get('clean')
  cleanText( @Query('input')  input: string): string {
    return this.appService.cleanSpaces(input);
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/file/:folder/:img')
  readFile(@Param('folder') folder: string, @Param('img') img: string): StreamableFile {
    
const file = createReadStream(
      join(process.cwd(), 'upload', folder, img),
    );

    return new StreamableFile(file)
  }
}
