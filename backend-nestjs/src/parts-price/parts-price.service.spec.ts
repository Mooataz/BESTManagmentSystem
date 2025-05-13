import { Test, TestingModule } from '@nestjs/testing';
import { PartsPriceService } from './parts-price.service';

describe('PartsPriceService', () => {
  let service: PartsPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartsPriceService],
    }).compile();

    service = module.get<PartsPriceService>(PartsPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
