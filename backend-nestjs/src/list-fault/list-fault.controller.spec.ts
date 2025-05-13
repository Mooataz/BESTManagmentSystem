import { Test, TestingModule } from '@nestjs/testing';
import { ListFaultController } from './list-fault.controller';
import { ListFaultService } from './list-fault.service';

describe('ListFaultController', () => {
  let controller: ListFaultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListFaultController],
      providers: [ListFaultService],
    }).compile();

    controller = module.get<ListFaultController>(ListFaultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
