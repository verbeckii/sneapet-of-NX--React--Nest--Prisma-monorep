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
  Date: '2021-12-20',
  DateCompare: '2021-12-19',
  Store_id: 1,
};
const doc = {
  Store_id: 1,
  Area_id: 1,
  TimeSlot: '2021-12-20',
  Visits: 200,
};

const doc1 = {
  Store_id: 1,
  Area_id: 1,
  TimeSlot: '2021-12-19',
  Visits: 200,
};

const doc2 = {
  Store_id: 1,
  Area_id: 2,
  TimeSlot: '2021-12-20',
  Visits: 200,
};

const doc3 = {
  Store_id: 1,
  Area_id: 2,
  TimeSlot: '2021-12-19',
  Visits: 200,
};

const doc4 = {
  Store_id: 1,
  Element_id: 1,
  Device_id: 1,
  TimeSlot: '2021-12-19',
  InsideMax: 10,
  Visits: 100,
};

const doc5 = {
  Store_id: 1,
  Element_id: 1,
  Device_id: 1,
  TimeSlot: '2021-12-20',
  InsideMax: 10,
  Visits: 100,
};

const doc6 = {
  Store_id: 1,
  Element_id: 2,
  Device_id: 1,
  TimeSlot: '2021-12-19',
  InsideMax: 10,
  Visits: 100,
};

const doc7 = {
  Store_id: 1,
  Element_id: 2,
  Device_id: 1,
  TimeSlot: '2021-12-20',
  InsideMax: 10,
  Visits: 100,
};
const doc8 = {
  Store_id: 1,
  Element_id: 2,
  Device_id: 2,
  TimeSlot: '2021-12-19',
  InsideMax: 10,
  Visits: 100,
};

const doc9 = {
  Store_id: 1,
  Element_id: 2,
  Device_id: 2,
  TimeSlot: '2021-12-20',
  InsideMax: 10,
  Visits: 100,
};

const resp = [
  {
    Area_Description: 'Floor 1',
    Area_id: 1,
    Height: 0,
    PictureUrl: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/116.png',
    Width: 0,
    data: [
      {
        key: 'Visits',
        title: 'Visits',
        value: 200,
        valueCompare: 200,
      },
    ],
    tipsFloor: [
      {
        code: 'BEST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.attendanceDays.bestFloor',
        valueText: 'Floor 2',
        valueText2: 200,
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.attendanceDays.worstFloor',
        valueText: 'Floor 2',
        valueText2: 200,
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'decrease',
        text: 'graphs.tips.attendanceDays.comparedTo',
        text1: 'Sunday 19 December 2021',
        valueText2: 0,
      },
    ],
    tipsZones: [
      {
        code: 'BEST',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.zones.mostVisited',
        text1: '',
        value: 100,
        valueText: 'desc2',
        valueText2: '(100)',
      },
      {
        code: 'BEST',
        key: 'DwellTime',
        state: '',
        text: 'graphs.tips.zones.highest',
        text1: 'Dwell Time',
        value: null,
        valueText: 'desc2',
        valueText2: '(0 s)',
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.zones.leastVisited',
        text1: '',
        value: 100,
        valueText: 'desc2',
        valueText2: '(100)',
      },
      {
        code: 'WORST',
        key: 'DwellTime',
        state: '',
        text: 'graphs.tips.zones.lowest',
        text1: 'Dwell Time',
        value: null,
        valueText: 'desc2',
        valueText2: '(0 s)',
      },
    ],
    zones: [
      {
        Device_id: 1,
        Element_Description: 'desc1',
        Element_id: 1,
        data: [
          {
            key: 'InsideMax',
            title: 'InsideMax',
            value: 10,
            valueCompare: 10,
          },
          {
            key: 'Visits',
            title: 'Visits',
            value: 100,
            valueCompare: 100,
          },
          {
            key: 'DwellTime',
            title: 'DwellTime',
            value: null,
            valueCompare: null,
          },
        ],
      },
      {
        Device_id: 1,
        Element_Description: 'desc2',
        Element_id: 2,
        data: [
          {
            key: 'InsideMax',
            title: 'InsideMax',
            value: 10,
            valueCompare: 10,
          },
          {
            key: 'Visits',
            title: 'Visits',
            value: 100,
            valueCompare: 100,
          },
          {
            key: 'DwellTime',
            title: 'DwellTime',
            value: null,
            valueCompare: null,
          },
        ],
      },
    ],
  },
  {
    Area_Description: 'Floor 2',
    Area_id: 2,
    Height: 0,
    PictureUrl: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/116.png',
    Width: 0,
    data: [
      {
        key: 'Visits',
        title: 'Visits',
        value: 200,
        valueCompare: 200,
      },
    ],
    zones: [],
    tipsZones: [],
  },
];

const resp1 = [
  {
    Area_Description: 'Floor 1',
    Area_id: 1,
    Height: 0,
    PictureUrl: 'https://s3-eu-west-1.amazonaws.com/assets.visionarea/116.png',
    Width: 0,
    data: [
      {
        key: 'Visits',
        title: 'Visits',
        value: 200,
        valueCompare: 200,
      },
    ],
    tipsFloor: [
      {
        code: 'BEST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.attendanceDays.bestFloor',
        valueText: 'Floor 1',
        valueText2: 200,
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: 'stable',
        text: 'graphs.tips.attendanceDays.worstFloor',
        valueText: 'Floor 1',
        valueText2: 200,
      },
      {
        code: 'COMPARE',
        key: 'Visits',
        state: 'decrease',
        text: 'graphs.tips.attendanceDays.comparedTo',
        text1: 'Sunday 19 December 2021',
        valueText2: 0,
      },
    ],
    tipsZones: [
      {
        code: 'BEST',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.zones.mostVisited',
        text1: '',
        value: 100,
        valueText: 'desc3',
        valueText2: '(100)',
      },
      {
        code: 'BEST',
        key: 'DwellTime',
        state: '',
        text: 'graphs.tips.zones.highest',
        text1: 'Dwell Time',
        value: null,
        valueText: 'desc3',
        valueText2: '(0 s)',
      },
      {
        code: 'WORST',
        key: 'Visits',
        state: '',
        text: 'graphs.tips.zones.leastVisited',
        text1: '',
        value: 100,
        valueText: 'desc3',
        valueText2: '(100)',
      },
      {
        code: 'WORST',
        key: 'DwellTime',
        state: '',
        text: 'graphs.tips.zones.lowest',
        text1: 'Dwell Time',
        value: null,
        valueText: 'desc3',
        valueText2: '(0 s)',
      },
    ],
    zones: [
      {
        Device_id: 1,
        Element_Description: 'desc1',
        Element_id: 1,
        data: [
          {
            key: 'InsideMax',
            title: 'InsideMax',
            value: 10,
            valueCompare: 10,
          },
          {
            key: 'Visits',
            title: 'Visits',
            value: 100,
            valueCompare: 100,
          },
          {
            key: 'DwellTime',
            title: 'DwellTime',
            value: null,
            valueCompare: null,
          },
        ],
      },
      {
        Device_id: 1,
        Element_Description: 'desc2',
        Element_id: 2,
        data: [
          {
            key: 'InsideMax',
            title: 'InsideMax',
            value: 10,
            valueCompare: 10,
          },
          {
            key: 'Visits',
            title: 'Visits',
            value: 100,
            valueCompare: 100,
          },
          {
            key: 'DwellTime',
            title: 'DwellTime',
            value: null,
            valueCompare: null,
          },
        ],
      },
      {
        Device_id: 2,
        Element_Description: 'desc3',
        Element_id: 2,
        data: [
          {
            key: 'InsideMax',
            title: 'InsideMax',
            value: 10,
            valueCompare: 10,
          },
          {
            key: 'Visits',
            title: 'Visits',
            value: 100,
            valueCompare: 100,
          },
          {
            key: 'DwellTime',
            title: 'DwellTime',
            value: null,
            valueCompare: null,
          },
        ],
      },
    ],
  },
];

describe('AttendanceDays-Controller (e2e)', () => {
  let db: Db;
  let apiKeyStrategy: ApiKeyStrategy;
  let collectionAttendanceDays;
  let collectionAreadays;
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
    await db.createCollection(Collections.attendancedays);
    collectionAttendanceDays = db.collection(Collections.attendancedays);
    await db.createCollection(Collections.areadays);
    collectionAreadays = db.collection(Collections.areadays);
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
      .post('/attendance/v1/days')
      .send(body);
    expect(result.statusCode).toBe(401);
  });

  it('test1 two areas, first with zones, second without zones, also it tests data from areadays', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd073';
    collectionAttendanceDays.insertMany([doc4, doc5, doc6, doc7]);
    collectionAreadays.insertMany([doc, doc1, doc2, doc3]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    await prismaHelpers.prismaAddArea(
      'areaCode1',
      1,
      'Floor 1',
      'https://s3-eu-west-1.amazonaws.com/assets.visionarea/116.png'
    );
    await prismaHelpers.prismaAddArea(
      'areaCode2',
      1,
      'Floor 2',
      'https://s3-eu-west-1.amazonaws.com/assets.visionarea/116.png'
    );
    await prismaHelpers.prismaAddDevice(
      'testdevicecode',
      '3D',
      'Europe/Rome',
      1,
      1,
      1
    );
    await prismaHelpers.prismaAddDevice(
      'testdevicecode1',
      '3D',
      'Europe/Rome',
      1,
      1,
      2
    );
    await prismaHelpers.prismaAddElementTypes(1, 'Presenti', 'attendance');
    await prismaHelpers.prismaAddDeviceElements(1, 1, 'desc1', 1);
    await prismaHelpers.prismaAddDeviceElements(1, 2, 'desc2', 1);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/attendance/v1/days')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

  it('test2 one area, two devices', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd064';
    collectionAttendanceDays.insertMany([doc4, doc5, doc6, doc7, doc8, doc9]);
    collectionAreadays.insertMany([doc, doc1]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    await prismaHelpers.prismaAddArea(
      'areaCode1',
      1,
      'Floor 1',
      'https://s3-eu-west-1.amazonaws.com/assets.visionarea/116.png'
    );
    await prismaHelpers.prismaAddDevice(
      'testdevicecode',
      '3D',
      'Europe/Rome',
      1,
      1,
      1
    );
    await prismaHelpers.prismaAddDevice(
      'testdevicecode1',
      '3D',
      'Europe/Rome',
      1,
      1,
      1
    );
    await prismaHelpers.prismaAddElementTypes(1, 'Presenti', 'attendance');
    await prismaHelpers.prismaAddDeviceElements(1, 1, 'desc1', 1);
    await prismaHelpers.prismaAddDeviceElements(1, 2, 'desc2', 1);
    await prismaHelpers.prismaAddDeviceElements(2, 2, 'desc3', 1);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/attendance/v1/days')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp1);
  });
});
