import { Test, TestingModule } from '@nestjs/testing';
import { StocKeeperService } from './stoc-keeper.service';

describe('StocKeeperService', () => {
  let service: StocKeeperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StocKeeperService],
    }).compile();

    service = module.get<StocKeeperService>(StocKeeperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
