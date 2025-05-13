import { Test, TestingModule } from '@nestjs/testing';
import { StockPartsService } from './stock-parts.service';

describe('StockPartsService', () => {
  let service: StockPartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockPartsService],
    }).compile();

    service = module.get<StockPartsService>(StockPartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
