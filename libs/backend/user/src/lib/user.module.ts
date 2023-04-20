import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CustomerIndexes, CustomerParams, UserIndexes } from '@visionarea-admin/queries';
@Module({
  controllers: [],
  providers: [UserService, CustomerIndexes, UserIndexes, CustomerParams],
  exports: [UserService],
})
export class UserModule {}
