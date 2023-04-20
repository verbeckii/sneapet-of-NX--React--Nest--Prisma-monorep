import { ObjectId } from 'mongodb';

export class Devices {
  id?: ObjectId;
  Store_id: number;
  Customer_id: number;
  Area_id: number;
  Device_id: number;
  DateIns: Date;
  TimeSlot: string;
  Operation: number;
}
export class DevicesDescription {
  id: number;
  Description: string | null
}
