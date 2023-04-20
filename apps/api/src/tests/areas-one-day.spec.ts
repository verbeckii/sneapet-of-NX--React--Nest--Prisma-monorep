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
  DateFrom: '2021-12-29',
  Area_id: 1,
  Store_id: 1,
};

const body1 = {
  DateFrom: '2021-12-29',
  Store_id: 1,
};

const doc1 = {
  Area_id: 1,
  Store_id: 1,
  TimeSlot: '2021-12-29:11',
  Visits: 60,
};
const doc2 = {
  Area_id: 1,
  Store_id: 1,
  TimeSlot: '2021-12-29:12',
  Visits: 60,
};
const doc3 = {
  Area_id: 2,
  Store_id: 1,
  TimeSlot: '2021-12-29:11',
  Visits: 60,
};
const doc4 = {
  Area_id: 2,
  Store_id: 1,
  TimeSlot: '2021-12-29:12',
  Visits: 60,
};

const resp = {
  Area_id: 1,
  timeslots: [
    {
      value: 0,
      hour: '10:00 AM',
    },
    {
      value: 60,
      hour: '11:00 AM',
    },
    {
      value: 60,
      hour: '12:00 PM',
    },
    {
      value: 0,
      hour: '01:00 PM',
    },
  ],
  total: 120,
};

const resp1 = {
  Area_id: 2,
  timeslots: [
    {
      value: 0,
      hour: '10:00 AM',
    },
    {
      value: 60,
      hour: '11:00 AM',
    },
    {
      value: 60,
      hour: '12:00 PM',
    },
    {
      value: 0,
      hour: '01:00 PM',
    },
  ],
  total: 120,
};
const resp2 = [resp, resp1];

describe('AreasOneDay-Controller (e2e)', () => {
  let db: Db;
  let collectionAreaHours;
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
    await db.createCollection(Collections.areahours);
    collectionAreaHours = db.collection(Collections.areahours);
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
      .post('/areas/v1/oneDay')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 with Area_id', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd042';
    collectionAreaHours.insertMany([doc1, doc2]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 13,
    });
    await prismaHelpers.prismaAddArea('areaCode1', 1);
    await prismaHelpers.prismaAddDevice(
      'testdevicecode',
      '3D',
      'Europe/Rome',
      1,
      1,
      1
    );
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/areas/v1/oneDay')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual([resp]);
  });

  it('test2 without Area_id', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd048';
    collectionAreaHours.insertMany([doc1, doc2, doc3, doc4]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 13,
    });
    await prismaHelpers.prismaAddArea('areaCode1', 1);
    await prismaHelpers.prismaAddArea('areaCode2', 1);
    await prismaHelpers.prismaAddDevice(
      'testdevicecode',
      '3D',
      'Europe/Rome',
      1,
      1,
      1
    );
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/areas/v1/oneDay')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp2);
  });
});
