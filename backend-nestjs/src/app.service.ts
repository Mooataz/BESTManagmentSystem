import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  cleanSpaces(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
  getHello(): string {
    return 'Hello amigo ';
  }
}
