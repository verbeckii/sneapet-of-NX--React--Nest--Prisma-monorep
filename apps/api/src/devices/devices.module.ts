import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from '@visionarea-admin/services';
import { Devices } from '@visionarea-admin/queries';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService, Devices],
})
export class DevicesModule {}
