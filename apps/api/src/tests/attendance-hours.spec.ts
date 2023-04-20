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
const storeCode = ['test_storeCode'];

const body = {
  Store_id: 1,
  Element_id: 1,
  Device_id: 1,
  Date: '2022-01-08',
};

const doc = {
  Device_id: 1,
  Element_id: 1,
  TimeSlot: '2022-01-08:12',
  InsideMax: 4,
  Store_id: 1,
  Visits: 3.4,
  DwellTime: 0,
  DwellTimeNum: 0,
  InsideTot: 5,
};

const doc1 = {
  Device_id: 1,
  Element_id: 1,
  TimeSlot: '2022-01-08:13',
  InsideMax: 4,
  Store_id: 1,
  Visits: 3.4,
  DwellTime: 0,
  DwellTimeNum: 0,
  InsideTot: 5,
};

const doc2 = {
  Device_id: 1,
  Element_id: 1,
  TimeSlot: '2022-01-08:14',
  InsideMax: 4,
  Store_id: 1,
  Visits: 3.4,
  DwellTime: 0,
  DwellTimeNum: 0,
  InsideTot: 5,
};

const doc3 = {
  Device_id: 1,
  Element_id: 1,
  TimeSlot: '2022-01-08:15',
  InsideMax: 4,
  Store_id: 1,
  Visits: 3.4,
  DwellTime: 0,
  DwellTimeNum: 0,
  InsideTot: 5,
};

const doc4 = {
  Device_id: 1,
  Element_id: 1,
  TimeSlot: '2022-01-08:16',
  InsideMax: 4,
  Store_id: 1,
  Visits: 3.4,
  DwellTime: 0,
  DwellTimeNum: 0,
  InsideTot: 5,
};

const resp = [
  {
    key: 'InsideMax',
    timeslots: [
      {
        hour: '01:00 PM',
        value: 4,
      },
      {
        hour: '02:00 PM',
        value: 4,
      },
      {
        hour: '03:00 PM',
        value: 4,
      },
    ],
    title: 'InsideMax',
  },
  {
    key: 'DwellTime',
    timeslots: [
      {
        hour: '01:00 PM',
        value: 0,
      },
      {
        hour: '02:00 PM',
        value: 0,
      },
      {
        hour: '03:00 PM',
        value: 0,
      },
    ],
    title: 'DwellTime',
  },
  {
    key: 'InsideTot',
    timeslots: [
      {
        hour: '01:00 PM',
        value: 5,
      },
      {
        hour: '02:00 PM',
        value: 5,
      },
      {
        hour: '03:00 PM',
        value: 5,
      },
    ],
    title: 'InsideTot',
  },
  {
    key: 'Visits',
    timeslots: [
      {
        hour: '01:00 PM',
        value: 3.4,
      },
      {
        hour: '02:00 PM',
        value: 3.4,
      },
      {
        hour: '03:00 PM',
        value: 3.4,
      },
    ],
    title: 'Visits',
  },
];

const resp1 = [
  {
    key: 'InsideMax',
    timeslots: [
      {
        hour: '02:00 PM',
        value: 0,
      },
      {
        hour: '03:00 PM',
        value: 0,
      },
    ],
    title: 'InsideMax',
  },
  {
    key: 'DwellTime',
    timeslots: [
      {
        hour: '02:00 PM',
        value: 0,
      },
      {
        hour: '03:00 PM',
        value: 0,
      },
    ],
    title: 'DwellTime',
  },
  {
    key: 'InsideTot',
    timeslots: [
      {
        hour: '02:00 PM',
        value: 0,
      },
      {
        hour: '03:00 PM',
        value: 0,
      },
    ],
    title: 'InsideTot',
  },
  {
    key: 'Visits',
    timeslots: [
      {
        hour: '02:00 PM',
        value: 0,
      },
      {
        hour: '03:00 PM',
        value: 0,
      },
    ],
    title: 'Visits',
  },
];

describe('AttendanceHours-Controller (e2e)', () => {
  let db: Db;
  let apiKeyStrategy: ApiKeyStrategy;
  let collectionAttendanceHours;
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
    await db.createCollection(Collections.attendancehour);
    collectionAttendanceHours = db.collection(Collections.attendancehour);
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
      .post('/attendance/v1/hours')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 values are in range of StartHour and EndHour', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd092';
    collectionAttendanceHours.insertMany([doc, doc1, doc2, doc3, doc4]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 13,
      EndHour: 15,
    });

    const response = await request(testAppSetup.app.getHttpServer())
      .post('/attendance/v1/hours')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

  it('test2 for missing data put 0 value', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-454545';
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 14,
      EndHour: 15,
    });

    const response = await request(testAppSetup.app.getHttpServer())
      .post('/attendance/v1/hours')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });
});
