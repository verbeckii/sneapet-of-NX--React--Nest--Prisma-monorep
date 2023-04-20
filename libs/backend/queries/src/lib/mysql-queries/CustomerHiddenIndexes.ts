import { Injectable } from '@nestjs/common';
import { prisma } from '@visionarea-admin/prisma-client';
import { constants } from '@visionarea-admin/common';

@Injectable()
export class CustomerIndexes {

  async qHiddenIndexes(customer_id: number): Promise<customerIndexes[]> {
    const array = [customer_id, constants.defaultCustomerId]
    const Indexes = await prisma.getClient().customerIndexes.findMany({
      select: {
        Customer_id: true,
        Key: true,
        isVisible: true
      },
      where: {
        Customer_id: {in:array},
      }
    });
    return Indexes;
  }
}
interface customerIndexes{
  Customer_id: number,
  Key: string,
  isVisible: boolean
}