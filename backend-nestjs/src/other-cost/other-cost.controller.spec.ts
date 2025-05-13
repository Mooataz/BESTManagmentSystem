import { Test, TestingModule } from '@nestjs/testing';
import { OtherCostController } from './other-cost.controller';
import { OtherCostService } from './other-cost.service';

describe('OtherCostController', () => {
  let controller: OtherCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtherCostController],
      providers: [OtherCostService],
    }).compile();

    controller = module.get<OtherCostController>(OtherCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
