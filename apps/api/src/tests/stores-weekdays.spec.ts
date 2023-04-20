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
  DateFrom: '2022-04-03',
  DateTo: '2022-04-09',
  Store_id: 1,
};

const body1 = {
  DateFrom: '2022-04-03',
  DateTo: '2022-04-16',
  Store_id: 1,
};

const doc1 = {
  Store_id: 1,
  TimeSlot: '2022-04-03',
  Visits: 12,
};
const doc2 = {
  Store_id: 1,
  TimeSlot: '2022-04-06',
  Visits: 12,
};
const doc3 = {
  Store_id: 1,
  TimeSlot: '2022-04-09',
  Visits: 12,
};
const doc5 = {
  Store_id: 1,
  TimeSlot: '2022-04-14',
  Visits: 12,
};
const doc6 = {
  Store_id: 1,
  TimeSlot: '2022-04-13',
  Visits: 12,
};

const resp = [
  {
    data: [
      {
        days: [
          {
            day: 0,
            value: 12,
            valuePerc: 0.3333333333333333,
            week: 15,
            year: 2022,
          },
          {
            day: 1,
            value: 0,
            valuePerc: 0,
            week: 15,
            year: 2022,
          },
          {
            day: 2,
            value: 0,
            valuePerc: 0,
            week: 15,
            year: 2022,
          },
          {
            day: 3,
            value: 12,
            valuePerc: 0.3333333333333333,
            week: 15,
            year: 2022,
          },
          {
            day: 4,
            value: 0,
            valuePerc: 0,
            week: 15,
            year: 2022,
          },
          {
            day: 5,
            value: 0,
            valuePerc: 0,
            week: 15,
            year: 2022,
          },
          {
            day: 6,
            value: 12,
            valuePerc: 0.3333333333333333,
            week: 15,
            year: 2022,
          },
          {
            day: 'Total',
            value: 36,
            valuePerc: 1,
            week: 15,
            year: 2022,
          },
        ],
        week: 15,
        year: 2022,
      },
    ],
    id: 2,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 1,
    title: 'Visits',
  },
];

const resp1 = [
  {
    data: [
      {
        days: [
          {
            day: 0,
            value: 12,
            valuePerc: 0.3333333333333333,
            week: 15,
            year: 2022,
          },
          {
            day: 1,
            value: 0,
            valuePerc: 0,
            week: 15,
            year: 2022,
          },
          {
            day: 2,
            value: 0,
            valuePerc: 0,
            week: 15,
            year: 2022,
          },
          {
            day: 3,
            value: 12,
            valuePerc: 0.3333333333333333,
            week: 15,
            year: 2022,
          },
          {
            day: 4,
            value: 0,
            valuePerc: 0,
            week: 15,
            year: 2022,
          },
          {
            day: 5,
            value: 0,
            valuePerc: 0,
            week: 15,
            year: 2022,
          },
          {
            day: 6,
            value: 12,
            valuePerc: 0.3333333333333333,
            week: 15,
            year: 2022,
          },
          {
            day: 'Total',
            value: 36,
            valuePerc: 1,
            week: 15,
            year: 2022,
          },
        ],
        week: 15,
        year: 2022,
      },
      {
        days: [
          {
            day: 0,
            value: 0,
            valuePerc: 0,
            week: 16,
            year: 2022,
          },
          {
            day: 1,
            value: 0,
            valuePerc: 0,
            week: 16,
            year: 2022,
          },
          {
            day: 2,
            value: 0,
            valuePerc: 0,
            week: 16,
            year: 2022,
          },
          {
            day: 3,
            value: 12,
            valuePerc: 0.5,
            week: 16,
            year: 2022,
          },
          {
            day: 4,
            value: 12,
            valuePerc: 0.5,
            week: 16,
            year: 2022,
          },
          {
            day: 5,
            value: 0,
            valuePerc: 0,
            week: 16,
            year: 2022,
          },
          {
            day: 6,
            value: 0,
            valuePerc: 0,
            week: 16,
            year: 2022,
          },
          {
            day: 'Total',
            value: 24,
            valuePerc: 1,
            week: 16,
            year: 2022,
          },
        ],
        week: 16,
        year: 2022,
      },
    ],
    id: 2,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 1,
    title: 'Visits',
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

describe('Stores Weekdays Controller (e2e)', () => {
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
      .post('/stores/v1/weekdays')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 one week', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc1, doc2, doc3]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    await prismaHelpers.prismaAddCustomerParams(customerData);
    await prismaHelpers.prismaAddCustomerParams(customerVisitsIndex);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/weekdays')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

  it('test1 2 weeks', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc1, doc2, doc3, doc5, doc6]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    await prismaHelpers.prismaAddCustomerParams(customerData);
    await prismaHelpers.prismaAddCustomerParams(customerVisitsIndex);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/weekdays')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });
});
