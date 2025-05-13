import { Test, TestingModule } from '@nestjs/testing';
import { AllPartsController } from './all-parts.controller';
import { AllPartsService } from './all-parts.service';

describe('AllPartsController', () => {
  let controller: AllPartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllPartsController],
      providers: [AllPartsService],
    }).compile();

    controller = module.get<AllPartsController>(AllPartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
