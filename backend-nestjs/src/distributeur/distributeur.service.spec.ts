import { Test, TestingModule } from '@nestjs/testing';
import { DistributeurService } from './distributeur.service';

describe('DistributeurService', () => {
  let service: DistributeurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistributeurService],
    }).compile();

    service = module.get<DistributeurService>(DistributeurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
