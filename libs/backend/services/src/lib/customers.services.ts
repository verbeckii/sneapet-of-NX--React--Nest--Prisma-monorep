import { Customers } from '@visionarea-admin/queries';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CustomersService {
  constructor(private readonly Customers: Customers) {}

  async getOptions(req: Request, res: Response) {
    try {
      const result = await this.Customers.qGetCustomerOptions();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
