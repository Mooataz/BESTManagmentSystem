import { Test, TestingModule } from '@nestjs/testing';
import { LegislationController } from './legislation.controller';
import { LegislationService } from './legislation.service';

describe('LegislationController', () => {
  let controller: LegislationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegislationController],
      providers: [LegislationService],
    }).compile();

    controller = module.get<LegislationController>(LegislationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
