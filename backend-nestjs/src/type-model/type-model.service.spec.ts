import { Test, TestingModule } from '@nestjs/testing';
import { TypeModelService } from './type-model.service';

describe('TypeModelService', () => {
  let service: TypeModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeModelService],
    }).compile();

    service = module.get<TypeModelService>(TypeModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
