import { Test, TestingModule } from '@nestjs/testing';
import { HistoryStockPartController } from './history-stock-part.controller';
import { HistoryStockPartService } from './history-stock-part.service';

describe('HistoryStockPartController', () => {
  let controller: HistoryStockPartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryStockPartController],
      providers: [HistoryStockPartService],
    }).compile();

    controller = module.get<HistoryStockPartController>(HistoryStockPartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
