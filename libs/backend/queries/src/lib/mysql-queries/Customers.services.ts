import { Injectable } from '@nestjs/common';
import { prisma } from '@visionarea-admin/prisma-client';

@Injectable()
export class Customers {
  async qGetCustomerOptions(): Promise<CustomerOptions[]> {
    const customers = await prisma.getClient().customers.findMany({
      select: {
        id: true,
        Description: true,
      },
    });
    return customers;
  }
}

type CustomerOptions = {
  id: number;
  Description: string;
};
