import { Module } from '@nestjs/common';
import { TokenService } from './token.service';

@Module({
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
