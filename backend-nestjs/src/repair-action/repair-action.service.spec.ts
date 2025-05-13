import { Test, TestingModule } from '@nestjs/testing';
import { RepairActionService } from './repair-action.service';

describe('RepairActionService', () => {
  let service: RepairActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepairActionService],
    }).compile();

    service = module.get<RepairActionService>(RepairActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
