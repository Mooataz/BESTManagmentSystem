import { Test, TestingModule } from '@nestjs/testing';
import { ApproveStockService } from './approve-stock.service';

describe('ApproveStockService', () => {
  let service: ApproveStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApproveStockService],
    }).compile();

    service = module.get<ApproveStockService>(ApproveStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
