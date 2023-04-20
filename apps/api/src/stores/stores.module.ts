import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from '@visionarea-admin/services';
import { Stores } from '@visionarea-admin/queries';

@Module({
  controllers: [StoresController],
  providers: [StoresService, Stores],
})
export class StoresModule {}
