import { Test, TestingModule } from '@nestjs/testing';
import { LevelRepairService } from './level-repair.service';

describe('LevelRepairService', () => {
  let service: LevelRepairService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelRepairService],
    }).compile();

    service = module.get<LevelRepairService>(LevelRepairService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
