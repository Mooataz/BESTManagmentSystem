import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRequestController } from './customer-request.controller';
import { CustomerRequestService } from './customer-request.service';

describe('CustomerRequestController', () => {
  let controller: CustomerRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerRequestController],
      providers: [CustomerRequestService],
    }).compile();

    controller = module.get<CustomerRequestController>(CustomerRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
