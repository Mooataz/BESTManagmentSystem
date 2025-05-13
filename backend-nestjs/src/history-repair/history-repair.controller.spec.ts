import { Test, TestingModule } from '@nestjs/testing';
import { HistoryRepairController } from './history-repair.controller';
import { HistoryRepairService } from './history-repair.service';

describe('HistoryRepairController', () => {
  let controller: HistoryRepairController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryRepairController],
      providers: [HistoryRepairService],
    }).compile();

    controller = module.get<HistoryRepairController>(HistoryRepairController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
