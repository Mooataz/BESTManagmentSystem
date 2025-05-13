import { Test, TestingModule } from '@nestjs/testing';
import { ExpertiseReasonsService } from './expertise-reasons.service';

describe('ExpertiseReasonsService', () => {
  let service: ExpertiseReasonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpertiseReasonsService],
    }).compile();

    service = module.get<ExpertiseReasonsService>(ExpertiseReasonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
