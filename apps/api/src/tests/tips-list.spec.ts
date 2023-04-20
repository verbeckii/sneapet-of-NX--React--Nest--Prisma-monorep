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

const body = {
  DateFrom: '2021-12-12',
  Period: 'custom',
  DateCompare: '2021-12-11',
  Store_id: 1,
  giveTips: true,
};

const body2 = {
  DateFrom: '2021-12-12',
  Period: 'weekday',
  Store_id: 1,
  giveTips: true,
};

const body3 = {
  DateFrom: '2021-12-12',
  Period: 'weekday',
  giveTips: true,
};

const doc = {
  Store_id: 1,
  TimeSlot: '2021-12-12',
  Visits: 20,
};

const doc1 = {
  Store_id: 1,
  TimeSlot: '2021-12-11',
  Visits: 22,
};

const doc5 = {
  Store_id: 1,
  TimeSlot: '2021-12-12',
  Visits: 20,
};

const doc6 = {
  Store_id: 1,
  TimeSlot: '2021-12-05',
  Visits: 21,
};

const doc7 = {
  Store_id: 1,
  TimeSlot: '2021-12-12',
  Visits: 191,
};
const doc8 = {
  Store_id: 1,
  TimeSlot: '2021-12-05',
  Visits: 191,
  Passersby: 21,
};
const doc9 = {
  Store_id: 2,
  TimeSlot: '2021-12-12',
  Visits: 191,
};
const doc10 = {
  Store_id: 2,
  TimeSlot: '2021-12-05',
  Visits: 191,
};
const doc11 = {
  Store_id: 1,
  TimeSlot: '2021-12-05',
  Visits: 191,
};

const resp = [
  {
    action: null,
    direction: -1,
    text: 'The number of Visits has decreased by 9.09%',
  },
];

const resp2 = [
  {
    action: null,
    direction: -1,
    text: 'The number of Visits has decreased by 4.76%',
  },
];

const resp3 = [
  {
    action: null,
    direction: 0,
    text: "The number of Visits hasn't changed",
  },
  {
    action: null,
    direction: -1,
    text: 'The number of Passersby has decreased by 100%',
  },
  {
    action: null,
    direction: 0,
    text: "The number of Groups hasn't changed",
  },
  {
    action: null,
    direction: -1,
    text: 'The number of Peeloff has decreased by 100%',
  },
];

const resp4 = [
  {
    action: null,
    direction: 0,
    text: "The number of Visits hasn't changed",
  },
  {
    action: null,
    direction: 2,
    text: 'The best performing store is Milano with 191 Visits',
  },
];

describe('TipsList-Controller (e2e)', () => {
  let db: Db;
  let collectionStoredays;
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
    await db.createCollection(Collections.storedays);
    collectionStoredays = db.collection(Collections.storedays);
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
      .post('/stores/v1/comparisonByTimeslots')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 when Period is custom and is indicated DateCompare', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd081';
    collectionStoredays.insertMany([doc, doc1]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: 'Milano',
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/tips/v1/list')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

  it('test3 when Period is weekday and isToday is false', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd081';
    collectionStoredays.insertMany([doc5, doc6]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: 'Milano',
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/tips/v1/list')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp2);
  });

  it('test4 when Passersby values is not zero and showGroup true', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd083';
    collectionStoredays.insertMany([doc7, doc8]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      showGroup: 1,
      Description: 'Milano',
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/tips/v1/list')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp3);
  });

  it('test5 when Store_id is not indicated', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd081';
    collectionStoredays.insertMany([doc7, doc9, doc10, doc11]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: 'Milano',
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/tips/v1/list')
      .send(body3)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp4);
  });
});
