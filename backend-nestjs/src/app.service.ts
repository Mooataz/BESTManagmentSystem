import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  cleanSpaces(value: string | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

   
  getHello(): string {
    return 'Hello amigo ';
  }
}
