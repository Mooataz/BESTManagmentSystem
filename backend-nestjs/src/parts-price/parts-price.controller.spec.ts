import { Test, TestingModule } from '@nestjs/testing';
import { PartsPriceController } from './parts-price.controller';
import { PartsPriceService } from './parts-price.service';

describe('PartsPriceController', () => {
  let controller: PartsPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartsPriceController],
      providers: [PartsPriceService],
    }).compile();

    controller = module.get<PartsPriceController>(PartsPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
