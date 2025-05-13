import { Test, TestingModule } from '@nestjs/testing';
import { OutputListController } from './output-list.controller';
import { OutputListService } from './output-list.service';

describe('OutputListController', () => {
  let controller: OutputListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutputListController],
      providers: [OutputListService],
    }).compile();

    controller = module.get<OutputListController>(OutputListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
