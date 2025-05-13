import { Test, TestingModule } from '@nestjs/testing';
import { HistoryRepairService } from './history-repair.service';

describe('HistoryRepairService', () => {
  let service: HistoryRepairService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryRepairService],
    }).compile();

    service = module.get<HistoryRepairService>(HistoryRepairService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
