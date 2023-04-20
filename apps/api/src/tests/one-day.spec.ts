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
  DateFrom: '2021-12-24',
  Store_id: 1,
};

const doc3 = {
  Store_id: 1,
  TimeSlot: '2021-12-24:11',
  Visits: 191,
  StaffCount: 3,
  Element_id: 0,
};

const doc4 = {
  Store_id: 1,
  TimeSlot: '2021-12-24:12',
  Visits: 191,
  Element_id: 0,
};

const doc11 = {
  City: 'Firenze',
  TimeStamp: new Date('2021-12-24T11:24:00'),
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
  TimeStamp: new Date('2021-12-24T12:24:00'),
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
    averageVisitorsByTimeslot: 0,
    bestTimeSlot: {
      hour: '01:00 PM',
      value: 0,
    },
    id: 2,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 1,
    timeslots: [
      {
        hour: '10:00 AM',
        value: 0,
      },
      {
        hour: '11:00 AM',
        value: 0,
      },
      {
        hour: '12:00 PM',
        value: 0,
      },
      {
        hour: '01:00 PM',
        value: 0,
      },
    ],
    tips: [
      {
        code: 'TOTAL',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.total',
        valueText: '0',
      },
      {
        code: 'AVG',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: "0",
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.timeSlots.best',
        valueText: '01:00 PM',
        valueText2: 0,
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.timeSlots.worst',
        valueText: '01:00 PM',
        valueText2: '0',
      },
    ],
    title: 'Visits',
    total: {
      value: 0,
    },
    worstTimeSlot: {
      hour: '01:00 PM',
      value: 0,
    },
  },
];

const resp1 = [
  {
    averageVisitorsByTimeslot: 0.75,
    bestTimeSlot: {
      hour: '11:00 AM',
      value: 3,
    },
    key: 'StaffCount',
    timeslots: [
      {
        hour: '10:00 AM',
        value: 0,
      },
      {
        alt: 'Partly cloudy',
        hour: '11:00 AM',
        src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
        value: 3,
      },
      {
        alt: 'Partly cloudy',
        hour: '12:00 PM',
        src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
        value: 0,
      },
      {
        hour: '01:00 PM',
        value: 0,
      },
    ],
    tips: [
      {
        code: 'TOTAL',
        key: 'StaffCount',
        state: 'stable',
        text: 'graphs.tips.total',
        valueText: '3',
      },
      {
        code: 'AVG',
        key: 'StaffCount',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: '0.75',
      },
      {
        code: 'BEST',
        key: 'StaffCount',
        state: 'stable',
        text: 'graphs.tips.timeSlots.best',
        valueText: '11:00 AM',
        valueText2: 3,
      },
      {
        code: 'WORST',
        key: 'StaffCount',
        state: 'stable',
        text: 'graphs.tips.timeSlots.worst',
        valueText: '01:00 PM',
        valueText2: '0',
      },
    ],
    title: 'StaffCount',
    total: {
      alt: 'Partly cloudy',
      src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
      value: 3,
    },
    worstTimeSlot: {
      hour: '01:00 PM',
      value: 0,
    },
  },
  {
    averageVisitorsByTimeslot: 95.5,
    bestTimeSlot: {
      hour: '12:00 PM',
      value: 191,
    },
    key: 'Visits',
    timeslots: [
      {
        hour: '10:00 AM',
        value: 0,
      },
      {
        alt: 'Partly cloudy',
        hour: '11:00 AM',
        src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
        value: 191,
      },
      {
        alt: 'Partly cloudy',
        hour: '12:00 PM',
        src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
        value: 191,
      },
      {
        hour: '01:00 PM',
        value: 0,
      },
    ],
    tips: [
      {
        code: 'TOTAL',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.total',
        valueText: '382',
      },
      {
        code: 'AVG',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: "95.5",
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.timeSlots.best',
        valueText: '12:00 PM',
        valueText2: 191,
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.timeSlots.worst',
        valueText: '01:00 PM',
        valueText2: '0',
      },
    ],
    title: 'Visits',
    total: {
      alt: 'Partly cloudy',
      src: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/weather/64x64/night/116.png',
      value: 382,
    },
    worstTimeSlot: {
      hour: '01:00 PM',
      value: 0,
    },
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

describe('OneDay-Controller (e2e)', () => {
  let db: Db;
  let collectionStoreHours;
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
    await db.createCollection(Collections.storehours);
    collectionStoreHours = db.collection(Collections.storehours);
    await db.createCollection('weather');
    collectionWeather = db.collection('weather');
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
      .post('/stores/v1/oneDay')
      .send(body1);
    expect(result.statusCode).toBe(401);
  });

  it('test1 weather, indexes testing', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd085';
    collectionStoreHours.insertMany([doc3, doc4]);
    collectionWeather.insertMany([doc11, doc12]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      City: 'Firenze',
      StartHour: 10,
      EndHour: 13,
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
      .post('/stores/v1/oneDay')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });

  it('test2 mongodb do not return data and store do not have city in db', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd084';
    collectionWeather.insertMany([doc11, doc12]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 13,
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
    await prismaHelpers.prismaAddCustomerParams(customerData);
    await prismaHelpers.prismaAddCustomerParams(customerVisitsIndex);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/oneDay')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });
});
