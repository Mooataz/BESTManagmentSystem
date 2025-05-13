import { Test, TestingModule } from '@nestjs/testing';
import { TracabilityService } from './tracability.service';

describe('TracabilityService', () => {
  let service: TracabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TracabilityService],
    }).compile();

    service = module.get<TracabilityService>(TracabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
