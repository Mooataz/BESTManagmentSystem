import { Test, TestingModule } from '@nestjs/testing';
import { AllPartsService } from './all-parts.service';

describe('AllPartsService', () => {
  let service: AllPartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllPartsService],
    }).compile();

    service = module.get<AllPartsService>(AllPartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
