import { Test, TestingModule } from '@nestjs/testing';
import { LawController } from '../law.controller';
import { LawService } from '../law.service';

describe('LawController', () => {
  let controller: LawController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LawController],
      providers: [LawService],
    }).compile();

    controller = module.get<LawController>(LawController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
