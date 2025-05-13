import { StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    cleanText(input: string): string;
    getHello(): string;
    readFile(folder: any, img: any): StreamableFile;
}
