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
  DateTo: '2022-01-15',
  Store_id: 1,
  DayFilter: 3,
};

const body1 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-15',
  Store_id: 1,
};

const body2 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-15',
  Store_id: 1,
  Aggregation: "week"
};

const body3 = {
  DateFrom: '2022-01-01',
  DateTo: '2022-01-15',
  Store_id: 1,
  Aggregation: "month"
};

const doc1 = {
  Store_id: 1,
  TimeSlot: '2022-01-05:11',
  Visits: 191,
  Element_id: 0,
};

const doc2 = {
  Store_id: 1,
  TimeSlot: '2022-01-05:12',
  Visits: 191,
  Element_id: 0,
};

const doc3 = {
  Store_id: 1,
  TimeSlot: '2022-01-06:11',
  Visits: 191,
  Element_id: 0,
};

const doc4 = {
  Store_id: 1,
  TimeSlot: '2022-01-06:12',
  Visits: 191,
  Element_id: 0,
};

const doc5 = {
  Store_id: 1,
  TimeSlot: '2022-01-07:11',
  Visits: 191,
  Element_id: 0,
};

const doc6 = {
  Store_id: 1,
  TimeSlot: '2022-01-07:12',
  Visits: 191,
  Element_id: 0,
};
const doc7 = {
  Store_id: 1,
  TimeSlot: '2022-01-05:11',
  Visits: 191,
  Element_id: 0,
  Passersby: 21,
};

const doc8 = {
  Store_id: 1,
  TimeSlot: '2022-01-05:12',
  Visits: 191,
  Element_id: 0,
  Passersby: 21,
};

const resp1 = [
  {
    data: [
      {
        date: '2022-01-05',
        timeslots: [
          {
            hour: '10:00 AM',
            value: 0,
          },
          {
            hour: '11:00 AM',
            value: 191,
          },
          {
            hour: '12:00 PM',
            value: 191,
          },
          {
            hour: '01:00 PM',
            value: 0,
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
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: 382,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.timeslot.best',
        valueText: '2022-01-05',
        valueText2: 382,
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.timeslot.worst',
        valueText: '2022-01-05',
        valueText2: 382,
      },
    ],
    title: 'Visits',
  },
  {
    data: [
      {
        date: '2022-01-05',
        timeslots: [
          {
            hour: '10:00 AM',
            value: 0,
          },
          {
            hour: '11:00 AM',
            value: 21,
          },
          {
            hour: '12:00 PM',
            value: 21,
          },
          {
            hour: '01:00 PM',
            value: 0,
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
    tips: [
      {
        code: 'AVG',
        key: 'Passersby',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: 42,
      },
      {
        code: 'BEST',
        key: 'Passersby',
        state: 'stable',
        text: 'graphs.tips.timeslot.best',
        valueText: '2022-01-05',
        valueText2: 42,
      },
      {
        code: 'WORST',
        key: 'Passersby',
        state: 'stable',
        text: 'graphs.tips.timeslot.worst',
        valueText: '2022-01-05',
        valueText2: 42,
      },
    ],
    title: 'Passersby',
  },
  {
    data: [
      {
        date: '2022-01-05',
        timeslots: [
          {
            hour: '10:00 AM',
            value: 0,
          },
          {
            hour: '11:00 AM',
            value: 9.095238095238095,
          },
          {
            hour: '12:00 PM',
            value: 9.095238095238095,
          },
          {
            hour: '01:00 PM',
            value: 0,
          },
        ],
        total: 4.5476190476190474,
        undefined: 0,
        year: 2022,
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
        valueText: 4.5476190476190474,
      },
      {
        code: 'BEST',
        key: 'Peeloff',
        state: 'stable',
        text: 'graphs.tips.timeslot.best',
        valueText: '2022-01-05',
        valueText2: 4.5476190476190474,
      },
      {
        code: 'WORST',
        key: 'Peeloff',
        state: 'stable',
        text: 'graphs.tips.timeslot.worst',
        valueText: '2022-01-05',
        valueText2: 4.5476190476190474,
      },
    ],
    title: 'Peeloff',
  },
];

const resp2 = [
  {
    data: [
      {
        date: '2022-01-05',
        timeslots: [
          {
            hour: '10:00 AM',
            value: 0,
          },
          {
            hour: '11:00 AM',
            value: 191,
          },
          {
            hour: '12:00 PM',
            value: 191,
          },
          {
            hour: '01:00 PM',
            value: 0,
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
    tips: [
      {
        code: 'AVG',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.avg',
        valueText: 382,
      },
      {
        code: 'BEST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.timeslot.best',
        valueText: '2022-01-05',
        valueText2: 382,
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.timeslot.worst',
        valueText: '2022-01-05',
        valueText2: 382,
      },
    ],
    title: 'Visits',
  },
  {
    data: [
      {
        date: '2022-01-05',
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
        total: 0,
        undefined: 0,
        year: 2022,
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
        valueText: 0,
      },
      {
        code: 'BEST',
        key: 'Groups',
        state: 'stable',
        text: 'graphs.tips.timeslot.best',
        valueText: '2022-01-05',
        valueText2: 0,
      },
      {
        code: 'WORST',
        key: 'Groups',
        state: 'stable',
        text: 'graphs.tips.timeslot.worst',
        valueText: '2022-01-05',
        valueText2: 0,
      },
    ],
    title: 'Groups',
  },
];
const tips = [
  {
    code: 'AVG',
    key: 'Visits',
    state: 'stable',
    text: 'graphs.tips.avg',
    valueText: 1146,
  },
  {
    code: 'BEST',
    key: 'Visits',
    state: 'stable',
    text: 'graphs.tips.timeslot.best',
    valueText: '2022-01-05',
    valueText2: 1146,
  },
  {
    code: 'WORST',
    key: 'Visits',
    state: 'stable',
    text: 'graphs.tips.timeslot.worst',
    valueText: '2022-01-05',
    valueText2: 1146,
  },
]
const timeslots = [
  {
    hour: '10:00 AM',
    value: 0,
  },
  {
    hour: '11:00 AM',
    value: 573,
  },
  {
    hour: '12:00 PM',
    value: 573,
  },
  {
    hour: '01:00 PM',
    value: 0,
  },
]

const resp3 = [
  {
    data: [
      {
        date: '2022-01-05',
        timeslots: timeslots,
        total: 1146,
        undefined: 0,
        year: 2022,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
    tips: tips,
    title: 'Visits',
  },
];

const resp4 = [
  {
    data: [
      {
        date: '2022-01-05',
        timeslots: timeslots,
        total: 1146,
        week: 2,
        year: 2022,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
    tips: tips,
    title: 'Visits',
  },
];

const resp5 = [
  {
    data: [
      {
        date: '2022-01-05',
        timeslots: timeslots,
        total: 1146,
        month: 0,
        year: 2022,
      },
    ],
    id: 1,
    key: 'Visits',
    parentId: 0,
    sortingPriority: 100,
    tips: tips,
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

describe('Stores TimeSlots Controller (e2e)', () => {
  let db: Db;

  let collectionStoreHours;
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
      .post('/stores/v1/timeslots')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 with day filter, more indexes', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fdd13';
    collectionStoreHours.insertMany([doc7, doc8, doc3, doc4, doc5, doc6]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 13,
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
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/timeslots')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });

  it('test2 with day filter, showGroup true', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b';
    collectionStoreHours.insertMany([doc1, doc2, doc3, doc4, doc5, doc6]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 13,
      showGroup: 1,
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
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/timeslots')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp2);
  });

  it('test3 without day filter', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fdd13';
    collectionStoreHours.insertMany([doc1, doc2, doc3, doc4, doc5, doc6]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 13,
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
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/timeslots')
      .send(body1)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp3);
  });

  it('test4 aggr week', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fdd13';
    collectionStoreHours.insertMany([doc1, doc2, doc3, doc4, doc5, doc6]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 13,
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
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/timeslots')
      .send(body2)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp4);
  });

  it('test5 aggr month', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fdd13';
    collectionStoreHours.insertMany([doc1, doc2, doc3, doc4, doc5, doc6]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      StartHour: 10,
      EndHour: 13,
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
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/timeslots')
      .send(body3)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp5);
  });
});
