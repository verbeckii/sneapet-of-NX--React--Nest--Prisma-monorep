import { format } from 'date-fns';
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
import { PreviousYDate } from '@visionarea-admin/utils';

jest.mock('@visionarea-admin/auth');

const customerCode = 'test_customerCode';
const userCode = 'test_userCode';
const storeCode = ['test_storeCode', 'test1_storeCode'];
const storeCode1 = ['test_storeCode'];

const body = {
  Store_id: 1,
  DateFrom: format(new Date(), 'yyyy-MM-dd'),
  NumDays: 1,
  PreviousPeriod: 'year',
  DateCompare: '2020-11-24',
};
const body1 = {
  DateFrom: '2021-12-09',
  PreviousPeriod: 'year',
  DateCompare: '2020-11-24',
};
const body2 = {
  Store_id: 1,
  DateFrom: '2021-12-09',
  NumDays: 1,
  PreviousPeriod: 'year',
  DateCompare: '2020-08-24',
};

const body3 = {
  Store_id: 1,
  DateFrom: '2021-12-09',
  NumDays: 1,
  PreviousPeriod: 'month',
  DateCompare: '2020-08-24',
};

const body4 = {
  Store_id: 1,
  DateFrom: '2021-12-09',
  NumDays: 1,
  PreviousPeriod: 'week',
  DateCompare: '2020-11-24',
};
const doc = {
  Store_id: 1,
  TimeSlot: PreviousYDate(body.DateCompare).PreviousYearDateF,
  Visits: 191,
};

const doc1 = {
  Store_id: 1,
  TimeSlot: '2021-12-09',
  Visits: 191,
};

const doc14 = {
  Store_id: 1,
  TimeSlot: '2020-08-13',
  Visits: 191,
};

const doc2 = {
  Store_id: 1,
  TimeSlot: PreviousYDate(body.DateCompare, doc1.TimeSlot).PreviousYearDateF,
  Visits: 191,
};

const doc3 = {
  Store_id: 1,
  TimeSlot: '2021-12-02',
  Visits: 191,
};

const doc4 = {
  Store_id: 1,
  TimeSlot: PreviousYDate(body.DateCompare, doc3.TimeSlot).PreviousYearDateF,
  Visits: 191,
};

const doc5 = {
  Store_id: 2,
  TimeSlot: '2021-12-09',
  Visits: 191,
};

const doc6 = {
  Store_id: 2,
  TimeSlot: PreviousYDate(body.DateCompare, doc5.TimeSlot).PreviousYearDateF,
  Visits: 191,
};

const doc7 = {
  Store_id: 2,
  TimeSlot: '2021-12-02',
  Visits: 191,
};

const doc8 = {
  Store_id: 2,
  TimeSlot: PreviousYDate(body.DateCompare, doc7.TimeSlot).PreviousYearDateF,
  Visits: 191,
};

const doc9 = {
  Store_id: 1,
  TimeSlot: PreviousYDate(body.DateCompare, doc1.TimeSlot).PreviousYearDateF,
  Visits: 191,
  Groups: 20,
};
const doc10 = {
  Store_id: 1,
  TimeSlot: PreviousYDate(body.DateCompare, doc1.TimeSlot).PreviousYearDateF,
  Visits: 191,
  Groups: 20,
  Passersby: 21,
};
const doc13 = {
  Store_id: 1,
  TimeSlot: '2020-11-26',
  Visits: 191,
};

const doc11 = {
  City: 'Firenze',
  TimeStamp: new Date('2021-12-09T02:45:10.000+00:00'),
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
  TimeStamp: new Date('2020-12-03T02:45:10.000+00:00'),
  Temperature: 24,
  Condition: {
    text: 'Partly cloudy',
    icon: '//s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
    code: 1003,
  },
  isDay: true,
};
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const d = new Date();
const day = days[d.getDay()];
const resp = [
  {
    key: 'Visits',
    title: 'Visits',
    data: [
      {
        date: body.DateFrom,
        dateCompare: PreviousYDate(body.DateCompare).PreviousYearDateF,
        value: 0,
        valueCompare: 191,
        week: PreviousYDate(body.DateCompare).WeekNumber,
        weekCompare: PreviousYDate(body.DateCompare).WeekNumber,
      },
    ],
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: day,
        valueText: '0.00',
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
        text1: 2020,
        valueText: 100,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: PreviousYDate(body.DateCompare).PreviousYearDateF,
        valueText2: 191,
      },
    ],
  },
];

const resp1 = [
  {
    data: [
      {
        date: '2021-10-21',
        dateCompare: '2020-10-15',
        value: 0,
        valueCompare: 0,
        week: 42,
        weekCompare: 42,
      },
      {
        date: '2021-10-28',
        dateCompare: '2020-10-22',
        value: 0,
        valueCompare: 0,
        week: 43,
        weekCompare: 43,
      },
      {
        date: '2021-11-04',
        dateCompare: '2020-10-29',
        value: 0,
        valueCompare: 0,
        week: 44,
        weekCompare: 44,
      },
      {
        date: '2021-11-11',
        dateCompare: '2020-11-05',
        value: 0,
        valueCompare: 0,
        week: 45,
        weekCompare: 45,
      },
      {
        date: '2021-11-18',
        dateCompare: '2020-11-12',
        value: 0,
        valueCompare: 0,
        week: 46,
        weekCompare: 46,
      },
      {
        date: '2021-11-25',
        dateCompare: '2020-11-19',
        value: 0,
        valueCompare: 0,
        week: 47,
        weekCompare: 47,
      },
      {
        date: '2021-12-02',
        dateCompare: '2020-11-26',
        value: 191,
        valueCompare: 191,
        week: 48,
        weekCompare: 48,
      },
      {
        date: '2021-12-09',
        dateCompare: '2020-12-03',
        value: 191,
        valueCompare: 191,
        week: 49,
        weekCompare: 49,
      },
    ],
    key: 'Visits',
    title: 'Visits',
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: 'Thursday',
        valueText: '47.75',
      },
      {
        code: 'TREND',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2020,
        valueText: 0,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2021-12-02',
        valueText2: 191,
      },
    ],
  },
];

const resp2 = [
  {
    data: [
      {
        date: '2021-12-09',
        dateCompare: '2020-12-03',
        value: 191,
        valueCompare: 191,
        week: 49,
        weekCompare: 49,
      },
    ],
    key: 'Visits',
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: 'Thursday',
        valueText: '191.00',
      },
      {
        code: 'TREND',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2020,
        valueText: 0,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2021-12-09',
        valueText2: 191,
      },
    ],
    title: 'Visits',
  },
  {
    data: [
      {
        date: '2021-12-09',
        dateCompare: '2020-12-03',
        value: 0,
        valueCompare: 20,
        week: 49,
        weekCompare: 49,
      },
    ],
    key: 'Groups',
    tips: [
      {
        code: 'AVG',
        key: 'Groups',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: 'Thursday',
        valueText: '0.00',
      },
      {
        code: 'TREND',
        key: 'Groups',
        state: 'decrease',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Groups',
        state: 'decrease',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2020,
        valueText: 100,
      },
      {
        code: 'BEST',
        key: 'Groups',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2020-12-03',
        valueText2: 20,
      },
    ],
    title: 'Groups',
  },
];

const resp3 = [
  {
    data: [
      {
        date: '2021-12-09',
        dateCompare: '2020-12-03',
        value: 191,
        valueCompare: 191,
        week: 49,
        weekCompare: 49,
      },
    ],
    key: 'Visits',
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: 'Thursday',
        valueText: '191.00',
      },
      {
        code: 'TREND',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2020,
        valueText: 0,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2021-12-09',
        valueText2: 191,
      },
    ],
    title: 'Visits',
  },
  {
    data: [
      {
        date: '2021-12-09',
        dateCompare: '2020-12-03',
        value: 0,
        valueCompare: 21,
        week: 49,
        weekCompare: 49,
      },
    ],
    key: 'Passersby',
    tips: [
      {
        code: 'AVG',
        key: 'Passersby',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: 'Thursday',
        valueText: '0.00',
      },
      {
        code: 'TREND',
        key: 'Passersby',
        state: 'decrease',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Passersby',
        state: 'decrease',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2020,
        valueText: 100,
      },
      {
        code: 'BEST',
        key: 'Passersby',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2020-12-03',
        valueText2: 21,
      },
    ],
    title: 'Passersby',
  },
  {
    key: 'Groups',
    title: 'Groups',
    tips: [
      {
        code: 'AVG',
        key: 'Groups',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: 'Thursday',
        valueText: '0.00',
      },
      {
        code: 'TREND',
        key: 'Groups',
        state: 'decrease',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Groups',
        state: 'decrease',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2020,
        valueText: 100,
      },
      {
        code: 'BEST',
        key: 'Groups',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2020-12-03',
        valueText2: 20,
      },
    ],
    data: [
      {
        date: '2021-12-09',
        dateCompare: '2020-12-03',
        value: 0,
        valueCompare: 20,
        week: 49,
        weekCompare: 49,
      },
    ],
  },
];

const resp4 = [
  {
    data: [
      {
        date: '2021-12-09',
        dateCompare: '2020-12-03',
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
        week: 49,
        weekCompare: 49,
      },
    ],
    key: 'Visits',
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: 'Thursday',
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
        text1: 2020,
        valueText: 100,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2021-12-09',
        valueText2: 191,
      },
    ],
    title: 'Visits',
  },
];

const resp5 = [
  {
    data: [
      {
        date: '2021-12-09',
        dateCompare: '2020-11-26',
        value: 191,
        valueCompare: 191,
        week: 49,
        weekCompare: 48,
      },
    ],
    key: 'Visits',
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: 'Thursday',
        valueText: '191.00',
      },
      {
        code: 'TREND',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2020,
        valueText: 0,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2021-12-09',
        valueText2: 191,
      },
    ],
    title: 'Visits',
  },
];

const resp6 = [
  {
    data: [
      {
        date: '2021-12-09',
        dateCompare: '2020-08-13',
        value: 191,
        valueCompare: 191,
        week: 49,
        weekCompare: 33,
      },
    ],
    key: 'Visits',
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.trends.sameWeekday.avgVisitors',
        text1: 'Thursday',
        valueText: '191.00',
      },
      {
        code: 'TREND',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.trend',
        valueText: '',
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.comparedTo',
        text1: 2020,
        valueText: 0,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'neutral',
        text: 'graphs.tips.trends.bestDay',
        valueText: '2021-12-09',
        valueText2: 191,
      },
    ],
    title: 'Visits',
  },
];

describe('Same-Weekday-Controller (e2e)', () => {
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
      .post('/stores/v1/sameWeekday')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 when DateFrom represents the current date', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoredays.insertMany([doc]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/sameWeekday')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

  it('test2 when the optional parameters are not indicated and we have several stores', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07c';
    collectionStoredays.insertMany([
      doc1,
      doc2,
      doc3,
      doc4,
      doc5,
      doc6,
      doc7,
      doc8,
    ]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode1,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/sameWeekday')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });

  it('test3 when showGroup at customer is true', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07e';
    collectionStoredays.insertMany([doc1, doc9]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      showGroup: 1,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/sameWeekday')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp2);
  });
  it('test4 when Passersby is not zero', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07f';
    collectionStoredays.insertMany([doc1, doc10]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      showGroup: 1,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/sameWeekday')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp3);
  });

  it('test5 with weather', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd082';
    collectionStoredays.insertMany([doc1]);
    collectionWeather.insertMany([doc11, doc12]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      City: 'Firenze',
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/sameWeekday')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp4);
  });

  it('test6 period day', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd092';
    collectionStoredays.insertMany([doc1, doc13]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/sameWeekday')
      .send(body4)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp5);
  });

  it('test7 period month', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd092';
    collectionStoredays.insertMany([doc1, doc14]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/sameWeekday')
      .send(body3)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp6);
  });
});
