import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { UserService } from '@visionarea-admin/user';
import { TokenService } from '@visionarea-admin/token';
import { AuthUser } from '@visionarea-admin/common';

interface payload {
  sub: string;
  'https://visionarea.net/email': string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private UserService: UserService,
    private TokenService: TokenService
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.NX_AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.NX_AUTH0_AUDIENCE,
      issuer: `${process.env.NX_AUTH0_ISSUER_URL}`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: payload): Promise<AuthUser> {
    const user = await this.UserService.getByEmail(payload['https://visionarea.net/email']);
    if (user) {
      const jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      this.TokenService.put(jwt, user);
    }
    return user;
  }
}
