import { Test, TestingModule } from '@nestjs/testing';
import { ExpertiseReasonsController } from './expertise-reasons.controller';
import { ExpertiseReasonsService } from './expertise-reasons.service';

describe('ExpertiseReasonsController', () => {
  let controller: ExpertiseReasonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpertiseReasonsController],
      providers: [ExpertiseReasonsService],
    }).compile();

    controller = module.get<ExpertiseReasonsController>(ExpertiseReasonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
