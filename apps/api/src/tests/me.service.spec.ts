import { Test, TestingModule } from '@nestjs/testing';
import { CustomerParams } from '@visionarea-admin/queries';
import { MeService } from '@visionarea-admin/services';

describe('MeService', () => {
  let service: MeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeService, CustomerParams],
    }).compile();

    service = module.get<MeService>(MeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
