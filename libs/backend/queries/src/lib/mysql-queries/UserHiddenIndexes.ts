import { Injectable } from '@nestjs/common';
import { prisma } from '@visionarea-admin/prisma-client';
import { constants } from '@visionarea-admin/common';

@Injectable()
export class UserIndexes {

  async qDescription(user_id: number): Promise<customerParams[]> {
    const array = [user_id,constants.defaultCustomerId]
    const Params = await prisma.getClient().userHiddenIndexes.findMany({
      select: {
        Key:true
      },
      where: {
        User_id: {in:array}
      }
    });
    return Params;
  }
}


interface customerParams{
  Key:string
}