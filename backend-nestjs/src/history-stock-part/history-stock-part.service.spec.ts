import { Test, TestingModule } from '@nestjs/testing';
import { HistoryStockPartService } from './history-stock-part.service';

describe('HistoryStockPartService', () => {
  let service: HistoryStockPartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryStockPartService],
    }).compile();

    service = module.get<HistoryStockPartService>(HistoryStockPartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
