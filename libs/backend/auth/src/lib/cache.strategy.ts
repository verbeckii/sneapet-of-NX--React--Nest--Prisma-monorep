import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { TokenService } from '@visionarea-admin/token';
import { AuthUser } from '@visionarea-admin/common';

@Injectable()
export class CacheStrategy extends PassportStrategy(Strategy, 'cache') {
  constructor(private TokenService: TokenService) {
    super();
  }

  validate(key: string): AuthUser {
    const token = this.TokenService.get(key);
    return token?.user;
  }
}
