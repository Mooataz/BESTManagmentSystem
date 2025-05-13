import { Test, TestingModule } from '@nestjs/testing';
import { OutputListService } from './output-list.service';

describe('OutputListService', () => {
  let service: OutputListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutputListService],
    }).compile();

    service = module.get<OutputListService>(OutputListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
