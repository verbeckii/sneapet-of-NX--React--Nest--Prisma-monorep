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
  DateFrom: '2022-04-13',
};

const doc1 = {
  Store_id: 1,
  Device_id: 1,
  DateIns: '2022-04-13T11:45:00.000+00:00',
  TimeSlot: '2022-04-13:11',
  In: 8,
  Out: 7,
  Element_id: 0,
};

const doc2 = {
  Store_id: 1,
  Device_id: 1,
  DateIns: '2022-04-13T10:41:00.000+00:00',
  TimeSlot: '2022-04-13:10',
  In: 5,
  Out: 8,
  Element_id: 0,
};

const doc4 = {
  Store_id: 1,
  Device_id: 1,
  DateIns: '2022-04-13T11:46:00.000+00:00',
  TimeSlot: '2022-04-13:11',
  In: 10,
  Out: 10,
  Element_id: 0,
};

const doc5 = {
  Store_id: 1,
  Device_id: 1,
  DateIns: '2022-04-13T10:46:00.000+00:00',
  TimeSlot: '2022-04-13:10',
  In: 9,
  Out: 2,
  Element_id: 0,
};

const doc6 = {
  Store_id: 1,
  Device_id: 1,
  DateIns: '2022-04-13T10:46:00.000+00:00',
  TimeSlot: '2022-04-13:10',
  In: 1,
  Out: 2,
  Element_id: 0,
};

const resp = [
  {
    DateIns: '2022-04-13T09:00:00.000Z',
    In: 0,
    Inside: 0,
    Out: 0,
    TimeSlot: '2022-04-13:12',
    isOpen: true,
    label: '12:00',
    time: 1649840400000,
  },
  {
    DateIns: '2022-04-13T10:46:00.000+00:00',
    In: 14,
    Inside: 4,
    Out: 10,
    TimeSlot: '2022-04-13:10',
    label: '12:46',
    time: 1649843160000,
  },
  {
    DateIns: '2022-04-13T10:00:00.000Z',
    In: 14,
    Inside: 4,
    Out: 10,
    TimeSlot: '2022-04-13:13',
    label: '13:00',
    time: 1649844000000,
  },
  {
    DateIns: '2022-04-13T11:45:00.000+00:00',
    In: 22,
    Inside: 5,
    Out: 17,
    TimeSlot: '2022-04-13:11',
    label: '13:45',
    time: 1649846700000,
  },
  {
    DateIns: '2022-04-13T11:46:00.000+00:00',
    In: 32,
    Inside: 5,
    Out: 27,
    TimeSlot: '2022-04-13:11',
    label: '13:46',
    time: 1649846760000,
  },
];

describe('devices-history-Controller (e2e)', () => {
  let db: Db;
  let collectionTimings;
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
      .post('/devices/v1/history/1')
      .send(body1);
    expect(result.statusCode).toBe(401);
  });

  it('test1 filter data In should not be bigger than Out, add missed data', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd084';
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
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/devices/v1/history/1')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

  it('test2 sampling data', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd084';
    collectionTimings.insertMany([doc1, doc2, doc4, doc5, doc6]);
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
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/devices/v1/history/1')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toHaveLength(5);
  });
});
