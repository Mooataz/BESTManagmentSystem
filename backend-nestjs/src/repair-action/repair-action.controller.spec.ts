import { Test, TestingModule } from '@nestjs/testing';
import { RepairActionController } from './repair-action.controller';
import { RepairActionService } from './repair-action.service';

describe('RepairActionController', () => {
  let controller: RepairActionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepairActionController],
      providers: [RepairActionService],
    }).compile();

    controller = module.get<RepairActionController>(RepairActionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
