import { Test, TestingModule } from '@nestjs/testing';
import { BinController } from './bin.controller';
import { BinService } from './bin.service';

describe('BinController', () => {
  let controller: BinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BinController],
      providers: [BinService],
    }).compile();

    controller = module.get<BinController>(BinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
