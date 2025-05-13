import { Test, TestingModule } from '@nestjs/testing';
import { ApproveStockController } from './approve-stock.controller';
import { ApproveStockService } from './approve-stock.service';

describe('ApproveStockController', () => {
  let controller: ApproveStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApproveStockController],
      providers: [ApproveStockService],
    }).compile();

    controller = module.get<ApproveStockController>(ApproveStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
