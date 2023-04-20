import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@visionarea-admin/user';
import { TokenModule } from '@visionarea-admin/token';
import { ApiKeyStrategy } from './apikey.strategy';
import { CacheStrategy } from './cache.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ApiAuthGuard } from './auth.guard';
import { PermissionsGuard } from './permissions.guard';

@Module({
  imports: [TokenModule, UserModule, PassportModule],
  providers: [
    JwtStrategy,
    ApiKeyStrategy,
    CacheStrategy,
    ApiAuthGuard,
    PermissionsGuard,
  ],
  exports: [ApiAuthGuard, PermissionsGuard],
})
export class authModule {}
