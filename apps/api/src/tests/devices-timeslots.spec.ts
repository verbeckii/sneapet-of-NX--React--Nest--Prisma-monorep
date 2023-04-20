import { AppModule } from '../app/app.module';
import {
  testAppSetup,
  prismaHelpers,
  mongoDbManager,
} from '@visionarea-admin/tests';
import { ApiKeyStrategy } from '@visionarea-admin/auth';
import request from 'supertest';
import { Db } from 'mongodb';
import { Collections } from '@visionarea-admin/common';

jest.mock('@visionarea-admin/auth');

const customerCode = 'test_customerCode';
const userCode = 'test_userCode';
const storeCode = ['test_storeCode', 'test1_storeCode'];

const body1 = {
  City: 'Milano',
  DateFrom: '2022-04-13',
  DateTo: '2022-04-13',
  Store_id: 1,
};

const body2 = {
  City: 'Milano',
  DateFrom: '2022-04-13',
  DateTo: '2022-04-14',
  Store_id: 1,
};

const doc1 = {
  Store_id: 1,
  Device_id: 1,
  DateIns: '2022-04-13T11:45:00.00000:00',
  TimeSlot: '2022-04-13:11',
  In: 0,
  Out: 0,
};

const doc2 = {
  Store_id: 1,
  Device_id: 1,
  DateIns: '2022-04-13T10:45:00.00000:00',
  TimeSlot: '2022-04-13:12',
  In: 0,
  Out: 5,
};

const doc3 = {
  Store_id: 1,
  Device_id: 1,
  DateIns: '2022-04-14T10:45:00.00000:00',
  TimeSlot: '2022-04-14:10',
  In: 0,
  Out: 0,
};

const doc4 = {
  Store_id: 1,
  Device_id: 2,
  DateIns: '2022-04-13T11:45:00.00000:00',
  TimeSlot: '2022-04-13:11',
  In: 0,
  Out: 0,
};

const doc5 = {
  Store_id: 1,
  Device_id: 2,
  DateIns: '2022-04-13T10:45:00.00000:00',
  TimeSlot: '2022-04-13:12',
  In: 0,
  Out: 0,
};

const doc6 = {
  Store_id: 1,
  Device_id: 2,
  DateIns: '2022-04-14T10:45:00.00000:00',
  TimeSlot: '2022-04-14:10',
  In: 5,
  Out: 0,
};

const doc11 = {
  City: 'Milano',
  TimeStamp: new Date('2022-04-13T11:24:00'),
  Temperature: 24,
  Condition: {
    text: 'Partly cloudy',
    icon: '//s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
    code: 1003,
  },
  isDay: true,
};

const doc12 = {
  City: 'Milano',
  TimeStamp: new Date('2022-04-13T12:24:00'),
  Temperature: 24,
  Condition: {
    text: 'Partly cloudy',
    icon: '//s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
    code: 1003,
  },
  isDay: true,
};

const resp = [
  {
    data: [
      {
        description: null,
        device_id: 1,
        timeslots: [
          {
            Device_id: 1,
            timeslot: '00:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '01:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '02:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '03:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '04:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '05:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '06:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '07:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '08:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '09:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '10:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '11:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '12:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '01:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '02:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '03:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '04:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '05:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '06:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '07:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '08:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '09:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '10:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '11:00 PM',
            value: 0,
          },
          {
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: 'Total',
            value: 0,
          },
        ],
      },
      {
        description: null,
        device_id: 2,
        timeslots: [
          {
            Device_id: 2,
            timeslot: '00:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '01:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '02:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '03:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '04:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '05:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '06:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '07:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '08:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '09:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '10:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 2,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '11:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 2,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '12:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '01:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '02:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '03:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '04:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '05:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '06:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '07:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '08:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '09:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '10:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '11:00 PM',
            value: 0,
          },
          {
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: 'Total',
            value: 0,
          },
        ],
      },
    ],
    key: 'In',
    title: 'In',
  },
  {
    data: [
      {
        description: null,
        device_id: 1,
        timeslots: [
          {
            Device_id: 1,
            timeslot: '00:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '01:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '02:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '03:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '04:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '05:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '06:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '07:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '08:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '09:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '10:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '11:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '12:00 PM',
            value: 5,
          },
          {
            Device_id: 1,
            timeslot: '01:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '02:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '03:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '04:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '05:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '06:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '07:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '08:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '09:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '10:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '11:00 PM',
            value: 0,
          },
          {
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: 'Total',
            value: 5,
          },
        ],
      },
      {
        description: null,
        device_id: 2,
        timeslots: [
          {
            Device_id: 2,
            timeslot: '00:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '01:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '02:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '03:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '04:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '05:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '06:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '07:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '08:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '09:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '10:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 2,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '11:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 2,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '12:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '01:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '02:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '03:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '04:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '05:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '06:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '07:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '08:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '09:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '10:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '11:00 PM',
            value: 0,
          },
          {
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: 'Total',
            value: 0,
          },
        ],
      },
    ],
    key: 'Out',
    title: 'Out',
  },
];

const resp1 = [
  {
    data: [
      {
        description: null,
        device_id: 1,
        timeslots: [
          {
            Device_id: 1,
            timeslot: '00:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '01:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '02:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '03:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '04:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '05:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '06:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '07:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '08:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '09:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            timeslot: '10:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '11:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '12:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '01:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '02:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '03:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '04:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '05:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '06:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '07:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '08:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '09:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '10:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '11:00 PM',
            value: 0,
          },
          {
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: 'Total',
            value: 0,
          },
        ],
      },
      {
        description: null,
        device_id: 2,
        timeslots: [
          {
            Device_id: 2,
            timeslot: '00:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '01:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '02:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '03:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '04:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '05:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '06:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '07:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '08:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '09:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 2,
            timeslot: '10:00 AM',
            value: 5,
          },
          {
            Description: null,
            Device_id: 2,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '11:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 2,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '12:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '01:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '02:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '03:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '04:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '05:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '06:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '07:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '08:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '09:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '10:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '11:00 PM',
            value: 0,
          },
          {
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: 'Total',
            value: 5,
          },
        ],
      },
    ],
    key: 'In',
    title: 'In',
  },
  {
    data: [
      {
        description: null,
        device_id: 1,
        timeslots: [
          {
            Device_id: 1,
            timeslot: '00:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '01:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '02:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '03:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '04:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '05:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '06:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '07:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '08:00 AM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '09:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            timeslot: '10:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '11:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 1,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '12:00 PM',
            value: 5,
          },
          {
            Device_id: 1,
            timeslot: '01:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '02:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '03:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '04:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '05:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '06:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '07:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '08:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '09:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '10:00 PM',
            value: 0,
          },
          {
            Device_id: 1,
            timeslot: '11:00 PM',
            value: 0,
          },
          {
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: 'Total',
            value: 5,
          },
        ],
      },
      {
        description: null,
        device_id: 2,
        timeslots: [
          {
            Device_id: 2,
            timeslot: '00:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '01:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '02:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '03:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '04:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '05:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '06:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '07:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '08:00 AM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '09:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 2,
            timeslot: '10:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 2,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '11:00 AM',
            value: 0,
          },
          {
            Description: null,
            Device_id: 2,
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: '12:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '01:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '02:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '03:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '04:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '05:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '06:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '07:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '08:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '09:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '10:00 PM',
            value: 0,
          },
          {
            Device_id: 2,
            timeslot: '11:00 PM',
            value: 0,
          },
          {
            alt: 'Partly cloudy',
            src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
            timeslot: 'Total',
            value: 0,
          },
        ],
      },
    ],
    key: 'Out',
    title: 'Out',
  },
];

const customerData = {
  Customer_id: 1,
  Index: 'default',
  sortingPriority: 100,
  LightColor: '#709CFD',
  isHighlight: 0,
  DarkColor: '#709CFD',
  viewType: 'number',
  parentId: 0,
  alwaysShow: 0,
};
const customerVisitsIndex = {
  Customer_id: 1,
  Index: 'Visits',
  sortingPriority: 1,
  LightColor: '#709CFD',
  isHighlight: 0,
  DarkColor: '#709CFD',
  viewType: 'number',
  parentId: 0,
  alwaysShow: 1,
};

describe('devices-timeslots-Controller (e2e)', () => {
  let db: Db;
  let collectionTimings;
  let collectionWeather;
  let apiKeyStrategy: ApiKeyStrategy;
  let mockValidate;

  beforeAll(async () => {
    await mongoDbManager.start();
    await testAppSetup.initApp(AppModule);
  });

  beforeEach(async () => {
    await mongoDbManager.cleanup();
    await prismaHelpers.resetDb();
  });

  afterAll(() => mongoDbManager.stop());

  afterEach(async () => {
    await testAppSetup.closeApp();
    jest.resetModules();
  });

  jest.setTimeout(100000);
  beforeEach(async () => {
    db = mongoDbManager.getDb();
    await db.createCollection(Collections.timings);
    collectionTimings = db.collection(Collections.timings);
    await db.createCollection('weather');
    collectionWeather = db.collection('weather');
    apiKeyStrategy =
      testAppSetup.moduleFixture.get<ApiKeyStrategy>(ApiKeyStrategy);
    mockValidate = jest.fn().mockImplementation(apiKeyStrategy.validate);
    Object.defineProperty(apiKeyStrategy, 'validate', {
      value: mockValidate,
      configurable: true,
    });
  });

  it('test0 should return 401-unauthorized code if no credentials', async () => {
    const result = await request(testAppSetup.app.getHttpServer())
      .post('/devices/v1/timeslots')
      .send(body1);
    expect(result.statusCode).toBe(401);
  });

  it('test1 one day data and weather', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd084';
    collectionWeather.insertMany([doc11, doc12]);
    collectionTimings.insertMany([doc1, doc2, doc4, doc5]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 11,
      Show: 'In',
    });
    await prismaHelpers.prismaAddArea('areaCode', 1);
    await prismaHelpers.prismaAddDevice(
      'testdevicecode',
      '3D',
      'Europe/Rome',
      1,
      1,
      1
    );
    await prismaHelpers.prismaAddDevice(
      'test1devicecode',
      '3D',
      'Europe/Rome',
      1,
      1,
      1
    );
    await prismaHelpers.prismaAddCustomerParams(customerData);
    await prismaHelpers.prismaAddCustomerParams(customerVisitsIndex);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/devices/v1/timeslots')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

  it('test2 2 days data with weather', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd084';
    collectionWeather.insertMany([doc11, doc12]);
    collectionTimings.insertMany([doc1, doc2, doc3, doc4, doc5, doc6]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 11,
      Show: 'In',
    });
    await prismaHelpers.prismaAddArea('areaCode', 1);
    await prismaHelpers.prismaAddDevice(
      'testdevicecode',
      '3D',
      'Europe/Rome',
      1,
      1,
      1
    );
    await prismaHelpers.prismaAddDevice(
      'test1devicecode',
      '3D',
      'Europe/Rome',
      1,
      1,
      1
    );
    await prismaHelpers.prismaAddCustomerParams(customerData);
    await prismaHelpers.prismaAddCustomerParams(customerVisitsIndex);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/devices/v1/timeslots')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });
});
