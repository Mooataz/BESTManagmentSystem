import { Test, TestingModule } from '@nestjs/testing';
import { LevelRepairController } from './level-repair.controller';
import { LevelRepairService } from './level-repair.service';

describe('LevelRepairController', () => {
  let controller: LevelRepairController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelRepairController],
      providers: [LevelRepairService],
    }).compile();

    controller = module.get<LevelRepairController>(LevelRepairController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
