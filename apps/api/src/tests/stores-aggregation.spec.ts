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
  DateFrom: '2022-01-01',
  DateTo: '2022-01-06',
  CompareDateFrom: '2021-06-01',
  CompareDateTo: '2021-06-06',
  Store_id: 1,
  Aggregation: 'day',
};

const body1 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-08',
  CompareDateFrom: '2021-06-01',
  CompareDateTo: '2021-06-20',
  DayFilter: 3,
  Store_id: 1,
  Aggregation: 'week',
};
const body2 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-08',
  CompareDateFrom: '2021-06-01',
  CompareDateTo: '2021-06-30',
  DayFilter: 3,
  Store_id: 1,
  Aggregation: 'month',
};

const body3 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-08',
  CompareDateFrom: '2021-06-01',
  CompareDateTo: '2021-06-08',
  DayFilter: 3,
  Store_id: 1,
  Aggregation: 'day',
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
  TimeSlot: '2022-01-05',
  Visits: 191,
};

const doc3 = {
  Store_id: 1,
  TimeSlot: '2021-06-02',
  Visits: 191,
};

const doc7 = {
  Store_id: 1,
  TimeSlot: '2022-01-05',
  Visits: 191,
  Passersby: 21,
};

const doc8 = {
  Store_id: 1,
  TimeSlot: '2021-06-02',
  Visits: 191,
  Passersby: 21,
};

const doc4 = {
  Store_id: 1,
  TimeSlot: '2021-06-02',
  Visits: 191,
};

const doc5 = {
  Store_id: 1,
  TimeSlot: '2021-06-15',
  Visits: 191,
};

const doc6 = {
  Store_id: 1,
  TimeSlot: '2021-06-18',
  Visits: 191,
};

const doc11 = {
  City: 'Firenze',
  TimeStamp: new Date('2022-01-05T02:45:10.000+00:00'),
  Temperature: 24,
  Condition: {
    text: 'Partly cloudy',
    icon: '//s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
    code: 1003,
  },
  isDay: true,
};

const doc12 = {
  City: 'Firenze',
  TimeStamp: new Date('2021-06-30T02:45:10.000+00:00'),
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
        date: '2022-01-01',
        dateCompare: '2021-06-01',
        value: 0,
        valueCompare: 0,
        week: 52,
        weekCompare: 22,
      },
      {
        date: '2022-01-02',
        dateCompare: '2021-06-02',
        value: 0,
        valueCompare: 382,
        week: 52,
        weekCompare: 22,
      },
      {
        date: '2022-01-03',
        dateCompare: '2021-06-03',
        value: 191,
        valueCompare: 0,
        week: 1,
        weekCompare: 22,
      },
      {
        date: '2022-01-04',
        dateCompare: '2021-06-04',
        value: 191,
        valueCompare: 0,
        week: 1,
        weekCompare: 22,
      },
      {
        date: '2022-01-05',
        dateCompare: '2021-06-05',
        value: 191,
        valueCompare: 0,
        week: 1,
        weekCompare: 22,
      },
      {
        date: '2022-01-06',
        dateCompare: '2021-06-06',
        value: 0,
        valueCompare: 0,
        week: 1,
        weekCompare: 22,
      },
    ],
    id: 2,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 1,
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.oneWeek.avgVisitors',
        text1: '',
        valueText: '95.50',
      },
      {
        code: 'TREND',
        key: 'Visits',
        state: 'increase',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'increase',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2021,
        valueText: 50,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2021-06-02',
        valueText2: 382,
      },
    ],
    title: 'Visits',
  },
];
const resp1 = [
  {
    data: [
      {
        date: '2022-01-05',
        dateCompare: '2021-06-16',
        value: 191,
        valueCompare: 0,
        week: 1,
        weekCompare: 24,
      },
    ],
    id: 2,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 1,
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.oneWeek.avgVisitors',
        text1: '',
        valueText: '191.00',
      },
      {
        code: 'TREND',
        key: 'Visits',
        state: 'increase',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'increase',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2021,
        valueText: 100,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2022-01-05',
        valueText2: 191,
      },
    ],
    title: 'Visits',
  },
];

const resp2 = [
  {
    data: [
      {
        date: '2022-01-05',
        dateCompare: '2021-06-30',
        value: 191,
        valueCompare: 0,
        weather: {
          alt: 'Partly cloudy',
          src: '//s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
        },
        weatherCompare: {
          alt: 'Partly cloudy',
          src: '//s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
        },
        week: 1,
        weekCompare: 26,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 1,
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.oneWeek.avgVisitors',
        text1: '',
        valueText: '191.00',
      },
      {
        code: 'TREND',
        key: 'Visits',
        state: 'increase',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'increase',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2021,
        valueText: 100,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2022-01-05',
        valueText2: 191,
      },
    ],
    title: 'Visits',
  },
];

const resp3 = [
  {
    data: [
      {
        date: '2022-01-05',
        dateCompare: '2021-06-02',
        value: 382,
        valueCompare: 573,
        week: 1,
        weekCompare: 22,
      },
    ],
    id: 2,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 1,
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.oneWeek.avgVisitors',
        text1: '',
        valueText: '382.00',
      },
      {
        code: 'TREND',
        key: 'Visits',
        state: 'decrease',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'decrease',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2021,
        valueText: 33,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2021-06-02',
        valueText2: 573,
      },
    ],
    title: 'Visits',
  },
  {
    data: [
      {
        date: '2022-01-05',
        dateCompare: '2021-06-02',
        value: 21,
        valueCompare: 21,
        week: 1,
        weekCompare: 22,
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
        state: '',
        text: 'graphs.tips.trends.oneWeek.avgVisitors',
        text1: '',
        valueText: '21.00',
      },
      {
        code: 'TREND',
        key: 'Passersby',
        state: 'neutral',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Passersby',
        state: 'neutral',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2021,
        valueText: 0,
      },
      {
        code: 'BEST',
        key: 'Passersby',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2022-01-05',
        valueText2: 21,
      },
    ],
    title: 'Passersby',
  },
  {
    data: [
      {
        date: '2022-01-05',
        dateCompare: '2021-06-02',
        value: 18.19047619047619,
        valueCompare: 27.285714285714285,
        week: 1,
        weekCompare: 22,
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
        state: '',
        text: 'graphs.tips.trends.oneWeek.avgVisitors',
        text1: '',
        valueText: '18.19',
      },
      {
        code: 'TREND',
        key: 'Peeloff',
        state: 'decrease',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Peeloff',
        state: 'decrease',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2021,
        valueText: 33,
      },
      {
        code: 'BEST',
        key: 'Peeloff',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2021-06-02',
        valueText2: 27.285714285714285,
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

describe('Stores Aggregation Controller (e2e)', () => {
  let db: Db;
  let collectionStoredays;
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
    await db.createCollection(Collections.storedays);
    await db.createCollection('weather');
    collectionWeather = db.collection('weather');
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
      .post('/stores/v1/aggregation')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 aggregation day, all days', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc, doc1, doc2, doc3, doc4]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    await prismaHelpers.prismaAddCustomerParams(customerData);
    await prismaHelpers.prismaAddCustomerParams(customerVisitsIndex);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/aggregation')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });
  it('test2 aggregation week, weekday, one interval time is bigger than other', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc, doc1, doc2, doc3, doc4, doc5, doc6]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });

    await prismaHelpers.prismaAddCustomerParams(customerVisitsIndex);
    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/aggregation')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });

  it('test3 weather, aggregation month', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd031';
    collectionStoredays.insertMany([doc, doc1, doc2, doc3, doc4]);
    collectionWeather.insertMany([doc11, doc12]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      City: 'Firenze',
    });

    await prismaHelpers.prismaAddCustomerParams(customerVisitsIndex);
    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/aggregation')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp2);
  });

  it('test4 aggregation year, more indexes', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc, doc1, doc2, doc3, doc4, doc7, doc8]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });

    await prismaHelpers.prismaAddCustomerParams(customerVisitsIndex);
    await prismaHelpers.prismaAddCustomerParams(customerData);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/aggregation')
      .send(body3)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp3);
  });
});
