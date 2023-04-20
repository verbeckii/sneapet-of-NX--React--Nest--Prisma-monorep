import { Injectable } from '@nestjs/common';
import { prisma } from '@visionarea-admin/prisma-client';

@Injectable()
export class Stores {
  async qGetStoreOptions(): Promise<StoreOptions[]> {
    const stores = await prisma.getClient().stores.findMany({
      select: {
        id: true,
        Description: true,
        Customers: {
          select: {
            id: true,
          },
        },
      },
    });
    return stores;
  }
}

type StoreOptions = {
  id: number;
  Description: string;
};
