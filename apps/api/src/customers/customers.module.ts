import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from '@visionarea-admin/services';
import { Customers } from '@visionarea-admin/queries';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, Customers],
})
export class CustomersModule {}
