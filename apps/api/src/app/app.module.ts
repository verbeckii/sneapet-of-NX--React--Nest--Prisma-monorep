import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { MeModule } from '../me/me.module';
import { HealthCheckModule } from '../healthcheck/healthcheck.module';
import {
  authModule,
  ApiAuthGuard,
  PermissionsGuard,
} from '@visionarea-admin/auth';
import { UserModule } from '@visionarea-admin/user';
import { TokenModule } from '@visionarea-admin/token';
import { MongoExceptionFilter } from './app.filters';
import { DevicesModule } from '../devices/devices.module';
import { CustomersModule } from '../customers/customers.module';
import { StoresModule } from '../stores/stores.module';
@Module({
  imports: [
    MeModule,
    authModule,
    UserModule,
    TokenModule,
    HealthCheckModule,
    DevicesModule,
    CustomersModule,
    StoresModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ApiAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_FILTER, useClass: MongoExceptionFilter },
  ],
})
export class AppModule {}
