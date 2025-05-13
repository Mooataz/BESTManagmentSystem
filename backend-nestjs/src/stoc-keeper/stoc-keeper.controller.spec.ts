import { Test, TestingModule } from '@nestjs/testing';
import { StocKeeperController } from './stoc-keeper.controller';
import { StocKeeperService } from './stoc-keeper.service';

describe('StocKeeperController', () => {
  let controller: StocKeeperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocKeeperController],
      providers: [StocKeeperService],
    }).compile();

    controller = module.get<StocKeeperController>(StocKeeperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
