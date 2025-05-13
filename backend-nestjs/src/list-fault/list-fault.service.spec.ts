import { Test, TestingModule } from '@nestjs/testing';
import { ListFaultService } from './list-fault.service';

describe('ListFaultService', () => {
  let service: ListFaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListFaultService],
    }).compile();

    service = module.get<ListFaultService>(ListFaultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
