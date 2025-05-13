import { Test, TestingModule } from '@nestjs/testing';
import { OtherCostService } from './other-cost.service';

describe('OtherCostService', () => {
  let service: OtherCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtherCostService],
    }).compile();

    service = module.get<OtherCostService>(OtherCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
