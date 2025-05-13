import { Test, TestingModule } from '@nestjs/testing';
import { TracabilityController } from './tracability.controller';
import { TracabilityService } from './tracability.service';

describe('TracabilityController', () => {
  let controller: TracabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TracabilityController],
      providers: [TracabilityService],
    }).compile();

    controller = module.get<TracabilityController>(TracabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
