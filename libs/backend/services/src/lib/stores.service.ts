import { Stores } from '@visionarea-admin/queries';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class StoresService {
  constructor(private readonly Stores: Stores) {}

  async getOptions(req: Request, res: Response) {
    try {
      const result = await this.Stores.qGetStoreOptions();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
