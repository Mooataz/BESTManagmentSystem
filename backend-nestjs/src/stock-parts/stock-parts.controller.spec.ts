import { Test, TestingModule } from '@nestjs/testing';
import { StockPartsController } from './stock-parts.controller';
import { StockPartsService } from './stock-parts.service';

describe('StockPartsController', () => {
  let controller: StockPartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockPartsController],
      providers: [StockPartsService],
    }).compile();

    controller = module.get<StockPartsController>(StockPartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
