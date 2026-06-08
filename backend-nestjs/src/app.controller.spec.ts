import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamableFile } from '@nestjs/common';

jest.mock('fs', () => ({
  createReadStream: jest.fn().mockReturnValue('stream'),
}));

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const mockAppService = {
    cleanSpaces: jest.fn().mockReturnValue('cleaned result'),
    getHello: jest.fn().mockReturnValue('Hello amigo '),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /apiApp/clean', () => {
    it('should call cleanSpaces with input query', () => {
      const result = controller.cleanText('  hello   ');
      expect(service.cleanSpaces).toHaveBeenCalledWith('  hello   ');
      expect(result).toBe('cleaned result');
    });
  });

  describe('GET /apiApp/hello', () => {
    it('should call getHello', () => {
      const result = controller.getHello();
      expect(service.getHello).toHaveBeenCalled();
      expect(result).toBe('Hello amigo ');
    });
  });

  describe('GET /apiApp/file/:folder/:img', () => {
    it('should return a StreamableFile', () => {
      const result = controller.readFile('photos', 'img.jpg');
      expect(result).toBeInstanceOf(StreamableFile);
    });
  });
});
