import { Test } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    service = module.get(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
