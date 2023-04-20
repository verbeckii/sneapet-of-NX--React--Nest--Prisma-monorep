import { Devices } from '@visionarea-admin/queries';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class DevicesService {
  constructor(private readonly Devices: Devices) {}

  async allDevices(req: Request, res: Response) {
    try {
      const result = await this.Devices.qGetAllDevices();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createDevice(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await this.Devices.qCreateDevice(data);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDevice(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.Devices.qGetDevice(id);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateDevice(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await this.Devices.qUpdateDevice(data);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}
