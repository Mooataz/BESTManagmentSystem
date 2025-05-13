import { Test, TestingModule } from '@nestjs/testing';
import { TypeModelController } from './type-model.controller';
import { TypeModelService } from './type-model.service';

describe('TypeModelController', () => {
  let controller: TypeModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeModelController],
      providers: [TypeModelService],
    }).compile();

    controller = module.get<TypeModelController>(TypeModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
