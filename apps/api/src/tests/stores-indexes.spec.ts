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
  DateTo: '2022-01-15',
  CompareDateFrom: '2021-06-01',
  CompareDateTo: '2021-06-15',
  CalculationMode: 'sum',
};

const body1 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-15',
  CompareDateFrom: '2021-06-01',
  CompareDateTo: '2021-06-15',
  CalculationMode: 'avg',
};

const doc = {
  Store_id: 1,
  TimeSlot: '2022-01-03',
  Visits: 191,
};

const doc1 = {
  Store_id: 1,
  TimeSlot: '2022-01-04',
  Visits: 191,
};

const doc2 = {
  Store_id: 1,
  TimeSlot: '2022-01-06',
  Visits: 191,
};

const doc3 = {
  Store_id: 1,
  TimeSlot: '2021-06-02',
  Visits: 191,
};

const doc7 = {
  Store_id: 1,
  TimeSlot: '2022-01-04',
  Visits: 191,
  Passersby: 21,
};

const doc8 = {
  Store_id: 1,
  TimeSlot: '2021-06-08',
  Visits: 191,
  Passersby: 21,
};

const doc4 = {
  Store_id: 1,
  TimeSlot: '2021-06-04',
  Visits: 191,
};

const doc5 = {
  Store_id: 1,
  TimeSlot: '2021-06-15',
  Visits: 191,
};

const doc9 = {
  Store_id: 2,
  TimeSlot: '2022-01-03',
  Visits: 191,
};

const doc10 = {
  Store_id: 2,
  TimeSlot: '2022-01-04',
  Visits: 191,
};

const doc11 = {
  Store_id: 2,
  TimeSlot: '2022-01-06',
  Visits: 191,
};

const doc12 = {
  Store_id: 2,
  TimeSlot: '2021-06-02',
  Visits: 191,
};

const doc13 = {
  Store_id: 2,
  TimeSlot: '2022-01-04',
  Visits: 191,
  Passersby: 21,
};

const doc14 = {
  Store_id: 2,
  TimeSlot: '2021-06-08',
  Visits: 191,
  Passersby: 21,
};

const doc15 = {
  Store_id: 2,
  TimeSlot: '2021-06-04',
  Visits: 191,
};

const doc16 = {
  Store_id: 2,
  TimeSlot: '2021-06-15',
  Visits: 191,
};

const resp1 = [
  {
    data: [
      {
        Description: 'testStore1',
        storeId: 1,
        value: 573,
        valueCompare: 573,
      },
      {
        Description: 'testStore2',
        storeId: 2,
        value: 573,
        valueCompare: 573,
      },
      {
        Description: 'Total',
        storeId: -1,
        value: 1146,
        valueCompare: 1146,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: '573.00',
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.store.best',
        valueText: 'testStore1',
        valueText2: 573,
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.store.worst',
        valueText: 'testStore1',
        valueText2: 573,
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'decrease',
        text: 'graphs.tips.attendanceDays.comparedTo',
        text1: 'Tuesday 01 June 2021 - Tuesday 15 June 2021',
        valueText: 0,
      },
    ],
    title: 'Visits',
  },
];

const resp2 = [
  {
    data: [
      {
        Description: 'testStore1',
        storeId: 1,
        value: 191,
        valueCompare: 191,
      },
      {
        Description: 'testStore2',
        storeId: 2,
        value: 191,
        valueCompare: 191,
      },
      {
        Description: 'Total',
        storeId: -1,
        value: 382,
        valueCompare: 382,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: '191.00',
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.store.best',
        valueText: 'testStore1',
        valueText2: 191,
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.store.worst',
        valueText: 'testStore1',
        valueText2: 191,
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'decrease',
        text: 'graphs.tips.attendanceDays.comparedTo',
        text1: 'Tuesday 01 June 2021 - Tuesday 15 June 2021',
        valueText: 0,
      },
    ],
    title: 'Visits',
  },
];

const resp3 = [
  {
    data: [
      {
        Description: 'testStore1',
        storeId: 1,
        value: 191,
        valueCompare: 191,
      },
      {
        Description: 'testStore2',
        storeId: 2,
        value: 191,
        valueCompare: 191,
      },
      {
        Description: 'Total',
        storeId: -1,
        value: 382,
        valueCompare: 382,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: '191.00',
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.store.best',
        valueText: 'testStore1',
        valueText2: 191,
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.store.worst',
        valueText: 'testStore1',
        valueText2: 191,
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'decrease',
        text: 'graphs.tips.attendanceDays.comparedTo',
        text1: 'Tuesday 01 June 2021 - Tuesday 15 June 2021',
        valueText: 0,
      },
    ],
    title: 'Visits',
  },
  {
    data: [
      {
        Description: 'testStore1',
        storeId: 1,
        value: 21,
        valueCompare: 21,
      },
      {
        Description: 'testStore2',
        storeId: 2,
        value: 21,
        valueCompare: 21,
      },
      {
        Description: 'Total',
        storeId: -1,
        value: 42,
        valueCompare: 42,
      },
    ],
    id: 1,
    key: 'Passersby',
    parentId: 0,
    sortingPriority: 100,
    tips: [
      {
        code: 'AVG',
        key: 'Passersby',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: '21.00',
      },
      {
        code: 'BEST',
        key: 'Passersby',
        state: 'stable',
        text: 'graphs.tips.store.best',
        valueText: 'testStore1',
        valueText2: 21,
      },
      {
        code: 'WORST',
        key: 'Passersby',
        state: 'stable',
        text: 'graphs.tips.store.worst',
        valueText: 'testStore1',
        valueText2: 21,
      },
      {
        code: 'COMPARE',
        key: 'Passersby',
        state: 'decrease',
        text: 'graphs.tips.attendanceDays.comparedTo',
        text1: 'Tuesday 01 June 2021 - Tuesday 15 June 2021',
        valueText: 0,
      },
    ],
    title: 'Passersby',
  },
  {
    data: [
      {
        Description: 'testStore1',
        storeId: 1,
        value: 0,
        valueCompare: 0,
      },
      {
        Description: 'testStore2',
        storeId: 2,
        value: 0,
        valueCompare: 0,
      },
      {
        Description: 'Total',
        storeId: -1,
        value: 0,
        valueCompare: 0,
      },
    ],
    id: 1,
    key: 'Groups',
    parentId: 0,
    sortingPriority: 100,
    tips: [
      {
        code: 'AVG',
        key: 'Groups',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: '0.00',
      },
      {
        code: 'BEST',
        key: 'Groups',
        state: 'stable',
        text: 'graphs.tips.store.best',
        valueText: 'testStore1',
        valueText2: 0,
      },
      {
        code: 'WORST',
        key: 'Groups',
        state: 'stable',
        text: 'graphs.tips.store.worst',
        valueText: 'testStore1',
        valueText2: 0,
      },
      {
        code: 'COMPARE',
        key: 'Groups',
        state: 'decrease',
        text: 'graphs.tips.attendanceDays.comparedTo',
        text1: 'Tuesday 01 June 2021 - Tuesday 15 June 2021',
        valueText: 0,
      },
    ],
    title: 'Groups',
  },
  {
    data: [
      {
        Description: 'testStore1',
        storeId: 1,
        value: 9.095238095238095,
        valueCompare: 9.095238095238095,
      },
      {
        Description: 'testStore2',
        storeId: 2,
        value: 9.095238095238095,
        valueCompare: 9.095238095238095,
      },
      {
        Description: 'Total',
        storeId: -1,
        value: 9.095238095238095,
        valueCompare: 9.095238095238095,
      },
    ],
    id: 1,
    key: 'Peeloff',
    parentId: 0,
    sortingPriority: 100,
    tips: [
      {
        code: 'AVG',
        key: 'Peeloff',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: '9.10',
      },
      {
        code: 'BEST',
        key: 'Peeloff',
        state: 'stable',
        text: 'graphs.tips.store.best',
        valueText: 'testStore1',
        valueText2: 9.095238095238095,
      },
      {
        code: 'WORST',
        key: 'Peeloff',
        state: 'stable',
        text: 'graphs.tips.store.worst',
        valueText: 'testStore1',
        valueText2: 9.095238095238095,
      },
      {
        code: 'COMPARE',
        key: 'Peeloff',
        state: 'decrease',
        text: 'graphs.tips.attendanceDays.comparedTo',
        text1: 'Tuesday 01 June 2021 - Tuesday 15 June 2021',
        valueText: 0,
      },
    ],
    title: 'Peeloff',
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
describe('Stores Indexes Controller (e2e)', () => {
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
      .post('/stores/v1/indexes')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 sum calculation mode', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([
      doc,
      doc1,
      doc2,
      doc3,
      doc4,
      doc5,
      doc9,
      doc10,
      doc11,
      doc12,
      doc15,
      doc16,
    ]);
    await prismaHelpers.addDbApiKeyV2({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: storeDescription,
    });

    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/indexes')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });

  it('test2 avg calculation mode', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([
      doc,
      doc1,
      doc2,
      doc3,
      doc4,
      doc5,
      doc9,
      doc10,
      doc11,
      doc12,
      doc15,
      doc16,
    ]);
    await prismaHelpers.addDbApiKeyV2({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: storeDescription,
    });
    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/indexes')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp2);
  });

  it('test3 more indexes and showGroup true', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd073';
    collectionStoredays.insertMany([
      doc,
      doc7,
      doc2,
      doc3,
      doc4,
      doc5,
      doc8,
      doc9,
      doc13,
      doc14,
      doc11,
      doc12,
      doc15,
      doc16,
    ]);
    await prismaHelpers.addDbApiKeyV2({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      showGroup: 1,
      Description: storeDescription,
    });
    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/indexes')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp3);
  });
});
