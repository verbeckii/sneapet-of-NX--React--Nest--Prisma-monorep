import { Injectable } from '@nestjs/common';
import { AuthUser } from '@visionarea-admin/common';

@Injectable()
export class MeService {


  async find(user: AuthUser) {
    return user;
  }
}