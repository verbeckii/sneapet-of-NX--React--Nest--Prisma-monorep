import { format, subDays, getISOWeek, getWeekOfMonth } from 'date-fns';
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

const computeDate = (DateFrom: string, DateCompare: string) => {
  const DATEFROM = new Date(DateFrom);
  const WeekNumber = getWeekOfMonth(DATEFROM);
  const weekday = DATEFROM.getDay();
  const DateFrom1 = new Date(DateCompare);
  DateFrom1.setDate((WeekNumber - 1) * 7 + 1);
  const currentDay = DateFrom1.getDay();
  const distance = (weekday + 7 - currentDay) % 7;
  return format(
    DateFrom1.setDate(DateFrom1.getDate() + distance),
    'MM/dd/yyyy'
  );
};

const body = {
  Store_id: 1,
  DateFrom: format(new Date(), 'yyyy-MM-dd'),
  PreviousPeriod: 'year',
  DateCompare: '2020-11-24',
};

const body1 = {
  Store_id: 1,
  DateFrom: '2021-12-09',
  PreviousPeriod: 'year',
  DateCompare: '2020-11-24',
};

const body2 = {
  Store_id: 1,
  DateFrom: '2021-12-09',
  PreviousPeriod: 'month',
  DateCompare: '2020-08-24',
};

const body3 = {
  Store_id: 1,
  DateFrom: '2021-12-09',
  PreviousPeriod: 'week',
  DateCompare: '2020-11-24',
};

const resp = {
  title: 'Visits',
  key: 'Visits',
  data: [],
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
      valueText: format(subDays(new Date(body.DateFrom), 6), 'yyyy-MM-dd'),
      valueText2: 191,
    },
  ],
};
for (let i = 6; i >= 0; i--) {
  const DF = format(subDays(new Date(body.DateFrom), i), 'yyyy-MM-dd');
  const DC = format(
    subDays(PreviousYDate(body.DateCompare, body.DateFrom).PreviousYearDate, i),
    'yyyy-MM-dd'
  );
  resp.data.push({
    date: DF,
    dateCompare: DC,
    value: 191,
    valueCompare: 191,
    week: PreviousYDate(DF, DF).WeekNumber,
    weekCompare: PreviousYDate(DC, DF).WeekNumber,
  });
}

const resp1 = {
  title: 'Visits',
  key: 'Visits',
  data: [],
  tips: [
    {
      code: 'AVG',
      key: 'Visits',
      state: '',
      text: 'graphs.tips.trends.oneWeek.avgVisitors',
      text1: '',
      "valueText": "191.00",
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
      valueText: '2021-12-03',
      valueText2: 191,
    },
  ],
};
for (let i = 6; i >= 0; i--) {
  const DF = format(subDays(new Date(body1.DateFrom), i), 'yyyy-MM-dd');
  const DC = format(
    subDays(
      PreviousYDate(body1.DateCompare, body1.DateFrom).PreviousYearDate,
      i
    ),
    'yyyy-MM-dd'
  );
  resp1.data.push({
    date: DF,
    dateCompare: DC,
    value: 191,
    valueCompare: 191,
    week: PreviousYDate(DF, DF).WeekNumber,
    weekCompare: PreviousYDate(DC, DF).WeekNumber,
  });
}

const resp4 = {
  title: 'Visits',
  key: 'Visits',
  data: [],
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
      valueText: '2021-12-03',
      valueText2: 191,
    },
  ],
};
for (let i = 6; i >= 0; i--) {
  const DF = format(subDays(new Date(body1.DateFrom), i), 'yyyy-MM-dd');
  const DC = format(
    subDays(
      PreviousYDate(body1.DateCompare, body1.DateFrom).PreviousYearDate,
      i
    ),
    'yyyy-MM-dd'
  );
  if (i === 0) {
    resp4.data.push({
      date: DF,
      dateCompare: DC,
      value: 191,
      valueCompare: 191,
      week: PreviousYDate(DF, DF).WeekNumber,
      weekCompare: PreviousYDate(DC, DF).WeekNumber,
      weather: {
        alt: 'Partly cloudy',
        src: '//s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
      },
      weatherCompare: {
        alt: 'Partly cloudy',
        src: '//s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
      },
    });
  } else {
    resp4.data.push({
      date: DF,
      dateCompare: DC,
      value: 191,
      valueCompare: 191,
      week: PreviousYDate(DF, DF).WeekNumber,
      weekCompare: PreviousYDate(DC, DF).WeekNumber,
    });
  }
}

const resp2 = {
  title: 'Passersby',
  key: 'Passersby',
  data: [],
  tips: [
    {
      code: 'AVG',
      key: 'Passersby',
      state: '',
      text: 'graphs.tips.trends.oneWeek.avgVisitors',
      text1: '',
      valueText: '2.00',
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
      text1: 2020,
      valueText: 0,
    },
    {
      code: 'BEST',
      key: 'Passersby',
      state: 'neutral',
      text: 'graphs.tips.trends.bestDay',
      valueText: '2021-12-03',
      valueText2: 2,
    },
  ],
};
for (let i = 6; i >= 0; i--) {
  const DF = format(subDays(new Date(body1.DateFrom), i), 'yyyy-MM-dd');
  const DC = format(
    subDays(
      PreviousYDate(body1.DateCompare, body1.DateFrom).PreviousYearDate,
      i
    ),
    'yyyy-MM-dd'
  );
  resp2.data.push({
    date: DF,
    dateCompare: DC,
    value: 2,
    valueCompare: 2,
    week: PreviousYDate(DF, DF).WeekNumber,
    weekCompare: PreviousYDate(DC, DF).WeekNumber,
  });
}
const resp3 = {
  title: 'Groups',
  key: 'Groups',
  data: [],
  tips: [
    {
      code: 'AVG',
      key: 'Groups',
      state: '',
      text: 'graphs.tips.trends.oneWeek.avgVisitors',
      text1: '',
      valueText: '0.00',
    },
    {
      code: 'TREND',
      key: 'Groups',
      state: 'neutral',
      text: 'graphs.tips.trends.trend',
      valueText: '',
    },
    {
      code: 'COMPARE',
      key: 'Groups',
      state: 'neutral',
      text: 'graphs.tips.trends.comparedTo',
      text1: 2020,
      valueText: 0,
    },
  ],
};
for (let i = 6; i >= 0; i--) {
  const DF = format(subDays(new Date(body1.DateFrom), i), 'yyyy-MM-dd');
  const DC = format(
    subDays(
      PreviousYDate(body1.DateCompare, body1.DateFrom).PreviousYearDate,
      i
    ),
    'yyyy-MM-dd'
  );
  resp3.data.push({
    date: DF,
    dateCompare: DC,
    value: 0,
    valueCompare: 0,
    week: PreviousYDate(DF, DF).WeekNumber,
    weekCompare: PreviousYDate(DC, DF).WeekNumber,
  });
}

const doc1 = {
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

const doc2 = {
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

const resp5 = {
  title: 'Visits',
  key: 'Visits',
  data: [],
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
      valueText: '2021-12-03',
      valueText2: 191,
    },
  ],
};
for (let i = 6; i >= 0; i--) {
  const DF = format(subDays(new Date(body1.DateFrom), i), 'yyyy-MM-dd');
  const DC = subDays(new Date('2020-11-26'), i);
  const DCformated = format(subDays(new Date('2020-11-26'), i), 'yyyy-MM-dd');
  resp5.data.push({
    date: DF,
    dateCompare: DCformated,
    value: 191,
    valueCompare: 191,
    week: PreviousYDate(DF, DF).WeekNumber,
    weekCompare: getISOWeek(DC),
  });
}

const resp6 = {
  title: 'Visits',
  key: 'Visits',
  data: [],
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
      valueText: '2021-12-03',
      valueText2: 191,
    },
  ],
};
for (let i = 6; i >= 0; i--) {
  const DF = format(subDays(new Date(body2.DateFrom), i), 'yyyy-MM-dd');
  const DC = subDays(
    new Date(computeDate(body2.DateFrom, body2.DateCompare)),
    i
  );
  const DCformated = format(
    subDays(new Date(computeDate(body2.DateFrom, body2.DateCompare)), i),
    'yyyy-MM-dd'
  );
  resp6.data.push({
    date: DF,
    dateCompare: DCformated,
    value: 191,
    valueCompare: 191,
    week: PreviousYDate(DF, DF).WeekNumber,
    weekCompare: getISOWeek(DC),
  });
}

describe('OneWeek-Controller (e2e)', () => {
  let db: Db;
  let collectionStoredays;
  let apiKeyStrategy: ApiKeyStrategy;
  let mockValidate;
  let collectionWeather;

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
      .post('/stores/v1/oneWeek')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 when DateFrom represents the current date', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd09a';
    insertManyV1(new Date());
    insertManyV1(new Date(PreviousYDate(body.DateCompare).PreviousYearDateF));

    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/oneWeek')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual([resp]);
  });

  it('test2 when Passersby values are not zero and showGroup true', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd092';
    insertMany(new Date(body1.DateFrom));
    insertMany(
      new Date(
        PreviousYDate(body.DateCompare, body1.DateFrom).PreviousYearDateF
      )
    );
    const resp = [];
    resp.push(resp1);
    resp.push(resp2);
    resp.push(resp3);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      showGroup: 1,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/oneWeek')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

  it('test3 with weather', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd087';
    insertManyV1(new Date(body1.DateFrom));
    insertManyV1(
      new Date(
        PreviousYDate(body.DateCompare, body1.DateFrom).PreviousYearDateF
      )
    );
    collectionWeather.insertMany([doc1, doc2]);
    const resp = [];
    resp.push(resp4);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      City: 'Firenze',
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/oneWeek')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

  it('test4 period day', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd097';
    insertManyV1(new Date(body3.DateFrom));
    insertManyV1(new Date('2020-11-26'));
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/oneWeek')
      .send(body3)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual([resp5]);
  });

  it('test5 period month', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd047';
    insertManyV1(new Date(body2.DateFrom));
    insertManyV1(new Date(computeDate(body2.DateFrom, body2.DateCompare)));
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/oneWeek')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual([resp6]);
  });

  const insertMany = (date: Date) => {
    for (let i = 0; i < 7; i++) {
      const doc = {
        Store_id: 1,
        TimeSlot: format(subDays(date, i), 'yyyy-MM-dd'),
        Visits: 191,
        Passersby: 2,
      };
      collectionStoredays.insertOne(doc);
    }
  };
  const insertManyV1 = (date: Date) => {
    for (let i = 0; i < 7; i++) {
      const doc = {
        Store_id: 1,
        TimeSlot: format(subDays(date, i), 'yyyy-MM-dd'),
        Visits: 191,
      };
      collectionStoredays.insertOne(doc);
    }
  };
});
