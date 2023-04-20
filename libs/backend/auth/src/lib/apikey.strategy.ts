import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { UserService } from '@visionarea-admin/user';
import { TokenService } from '@visionarea-admin/token';
import { AuthUser } from '@visionarea-admin/common';


@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'apikey') {
  constructor(private UserService: UserService, private TokenService: TokenService) {
    super(
      { header: 'Authorization', prefix: 'Bearer ' },
      false
    );
  }

  validate = async (apikey: string): Promise<AuthUser> => {
    const user = await this.UserService.getByApyKey(apikey);
    if (user) this.TokenService.put(apikey, user);
    return user;
  }
}