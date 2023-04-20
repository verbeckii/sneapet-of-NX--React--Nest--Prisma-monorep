import { Injectable } from '@nestjs/common';
import { prisma } from '@visionarea-admin/prisma-client';

@Injectable()
export class Devices {
  async qGetAllDevices() {
    const devices = await prisma.getClient().devices.findMany({
      include: {
        Areas: true,
        Customers: true,
        Stores: true,
        DeviceElements: true,
        Zones: true,
        _count: true,
      },
    });
    return devices;
  }

  async qCreateDevice(data: any) {
    let { Customer, Store, ...rest } = data;
    rest.Area_id = 1;
    const devices = await prisma.getClient().devices.create({
      data: {
        ...rest,
      },
    });
    return devices;
  }

  async qGetDevice(id: number) {
    const devices = await prisma.getClient().devices.findFirst({
      where: {
        id,
      },
    });
    return devices;
  }

  async qUpdateDevice(data: any) {
    const devices = await prisma.getClient().devices.update({
      where: {
        id: data.id,
      },
      data,
    });
    return devices;
  }
}
