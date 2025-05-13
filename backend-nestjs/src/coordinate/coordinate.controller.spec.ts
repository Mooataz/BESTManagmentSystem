import { Test, TestingModule } from '@nestjs/testing';
import { CoordinateController } from './coordinate.controller';
import { CoordinateService } from './coordinate.service';

describe('CoordinateController', () => {
  let controller: CoordinateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoordinateController],
      providers: [CoordinateService],
    }).compile();

    controller = module.get<CoordinateController>(CoordinateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
