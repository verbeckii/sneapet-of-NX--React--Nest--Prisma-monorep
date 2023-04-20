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
const storeDescription = ['testStore1', 'testStore2'];

const body = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-01',
};
const body2 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-10',
  Aggregation: 'week',
};

const body3 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-10',
  Aggregation: 'month',
};

const body1 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-02',
};

const doc = {
  Store_id: 1,
  TimeSlot: '2022-01-01',
  Visits: 191,
};

const doc1 = {
  Store_id: 1,
  TimeSlot: '2022-01-02',
  Visits: 191,
};

const doc2 = {
  Store_id: 1,
  TimeSlot: '2022-01-01',
  Visits: 191,
  Passersby: 21,
};

const doc3 = {
  Store_id: 1,
  TimeSlot: '2021-06-02',
  Visits: 191,
  Passersby: 21,
};

const doc9 = {
  Store_id: 2,
  TimeSlot: '2022-01-01',
  Visits: 191,
};

const doc10 = {
  Store_id: 2,
  TimeSlot: '2022-01-02',
  Visits: 191,
};

const doc13 = {
  Store_id: 2,
  TimeSlot: '2022-01-01',
  Visits: 191,
  Passersby: 21,
};

const doc14 = {
  Store_id: 2,
  TimeSlot: '2021-06-02',
  Visits: 191,
  Passersby: 21,
};

const resp1 = [
  {
    data: [
      {
        date: '2022-01-01',
        storesData: [
          {
            Description: 'testStore1',
            counter: 1,
            storeId: 1,
            value: 191,
          },
          {
            Description: 'testStore2',
            counter: 1,
            storeId: 2,
            value: 191,
          },
        ],
        total: 382,
        undefined: 0,
        year: 2022,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
    title: 'Visits',
  },
  {
    data: [
      {
        date: '2022-01-01',
        storesData: [
          {
            Description: 'testStore1',
            counter: 1,
            storeId: 1,
            value: 21,
          },
          {
            Description: 'testStore2',
            counter: 1,
            storeId: 2,
            value: 21,
          },
        ],
        total: 42,
        undefined: 0,
        year: 2022,
      },
    ],
    id: 1,
    key: 'Passersby',
    parentId: 0,
    sortingPriority: 100,
    title: 'Passersby',
  },
  {
    data: [
      {
        date: '2022-01-01',
        storesData: [
          {
            Description: 'testStore1',
            counter: 1,
            storeId: 1,
            value: 9.095238095238095,
          },
          {
            Description: 'testStore2',
            counter: 1,
            storeId: 2,
            value: 9.095238095238095,
          },
        ],
        total: 9.095238095238095,
        undefined: 0,
        year: 2022,
      },
    ],
    id: 1,
    key: 'Peeloff',
    parentId: 0,
    sortingPriority: 100,
    title: 'Peeloff',
  },
];

const resp2 = [
  {
    data: [
      {
        date: '2022-01-01',
        storesData: [
          {
            Description: 'testStore1',
            counter: 2,
            storeId: 1,
            value: 382,
          },
          {
            Description: 'testStore2',
            counter: 2,
            storeId: 2,
            value: 382,
          },
        ],
        total: 764,
        undefined: 0,
        year: 2022,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
    title: 'Visits',
  },
];

const resp3 = [
  {
    data: [
      {
        allDates: [
          '2021-12-26',
          '2021-12-27',
          '2021-12-28',
          '2021-12-29',
          '2021-12-30',
          '2021-12-31',
          '2022-01-01',
        ],
        date: '2021-12-26',
        storesData: [
          {
            Description: 'testStore1',
            counter: 7,
            storeId: 1,
            value: 191,
          },
          {
            Description: 'testStore2',
            counter: 7,
            storeId: 2,
            value: 191,
          },
        ],
        total: 382,
        week: 1,
        year: 2022,
      },
      {
        allDates: [
          '2022-01-02',
          '2022-01-03',
          '2022-01-04',
          '2022-01-05',
          '2022-01-06',
          '2022-01-07',
          '2022-01-08',
        ],
        date: '2022-01-02',
        storesData: [
          {
            Description: 'testStore1',
            counter: 7,
            storeId: 1,
            value: 191,
          },
          {
            Description: 'testStore2',
            counter: 7,
            storeId: 2,
            value: 191,
          },
        ],
        total: 382,
        week: 2,
        year: 2022,
      },
      {
        allDates: [
          '2022-01-09',
          '2022-01-10',
          '2022-01-11',
          '2022-01-12',
          '2022-01-13',
          '2022-01-14',
          '2022-01-15',
        ],
        date: '2022-01-09',
        storesData: [
          {
            Description: 'testStore1',
            counter: 7,
            storeId: 1,
            value: 0,
          },
          {
            Description: 'testStore2',
            counter: 7,
            storeId: 2,
            value: 0,
          },
        ],
        total: 0,
        week: 3,
        year: 2022,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
    title: 'Visits',
  },
];

const resp4 = [
  {
    data: [
      {
        date: '2022-01-01',
        month: 0,
        storesData: [
          {
            Description: 'testStore1',
            counter: 31,
            storeId: 1,
            value: 382,
          },
          {
            Description: 'testStore2',
            counter: 31,
            storeId: 2,
            value: 382,
          },
        ],
        total: 764,
        year: 2022,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
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

describe('Stores FullIndexes Controller (e2e)', () => {
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
      .post('/stores/v1/fullindexes')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 one day in interval, more indexes', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc2, doc3, doc13, doc14]);
    await prismaHelpers.addDbApiKeyV2({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: storeDescription,
    });
    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/fullindexes')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });

  it('test2 2 days in interval', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc, doc1, doc9, doc10]);
    await prismaHelpers.addDbApiKeyV2({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: storeDescription,
    });

    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/fullindexes')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp2);
  });

  it('test3 aggregation week', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc, doc1, doc9, doc10]);
    await prismaHelpers.addDbApiKeyV2({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: storeDescription,
    });
    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/fullindexes')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp3);
  });

  it('test4 aggregation month', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc, doc1, doc9, doc10]);
    await prismaHelpers.addDbApiKeyV2({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: storeDescription,
    });

    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/fullindexes')
      .send(body3)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp4);
  });
});
