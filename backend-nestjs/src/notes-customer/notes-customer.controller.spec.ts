import { Test, TestingModule } from '@nestjs/testing';
import { NotesCustomerController } from './notes-customer.controller';
import { NotesCustomerService } from './notes-customer.service';

describe('NotesCustomerController', () => {
  let controller: NotesCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesCustomerController],
      providers: [NotesCustomerService],
    }).compile();

    controller = module.get<NotesCustomerController>(NotesCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
