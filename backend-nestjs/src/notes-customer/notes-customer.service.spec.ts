import { Test, TestingModule } from '@nestjs/testing';
import { NotesCustomerService } from './notes-customer.service';

describe('NotesCustomerService', () => {
  let service: NotesCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesCustomerService],
    }).compile();

    service = module.get<NotesCustomerService>(NotesCustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
