import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRequestService } from './customer-request.service';

describe('CustomerRequestService', () => {
  let service: CustomerRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerRequestService],
    }).compile();

    service = module.get<CustomerRequestService>(CustomerRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
