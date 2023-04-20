import { Module } from '@nestjs/common';
import { MeService } from '@visionarea-admin/services';
import { MeController } from './me.controller';

@Module({
  providers: [MeService],
  controllers: [MeController]
})

export class MeModule {}