import { Test, TestingModule } from '@nestjs/testing';
import { TechnicienController } from './technicien.controller';
import { TechnicienService } from './technicien.service';

describe('TechnicienController', () => {
  let controller: TechnicienController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicienController],
      providers: [TechnicienService],
    }).compile();

    controller = module.get<TechnicienController>(TechnicienController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
