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
    Date: '2021-12-29',
    Area_id: 1
}
const doc = {
    Area_id:1,
    TimeSlot:'2021-12-29:09',
    X:-1000,
    Y:1000,
    Event_id: 1
}
const doc1 = {
    Area_id:1,
    TimeSlot:'2021-12-29:10',
    X:-1000,
    Y:1000,
    Event_id: 2
}
const doc2 = {
    Area_id:1,
    TimeSlot:'2021-12-29:11',
    X:-1000,
    Y:1000,
    Event_id: 3
}
const doc3 = {
    Area_id:1,
    TimeSlot:'2021-12-29:12',
    X:-2000,
    Y:1000,
    Event_id: 4
}

const doc4 = {
    Area_id:1,
    TimeSlot:'2021-12-29:09',
    DateIns:new Date("2021-12-29T08:58:16.200Z"),
    Type:"TRACK_CREATE",
    Event_id: 1
}
const doc5 = {
    Area_id:1,
    TimeSlot:'2021-12-29:10',
    DateIns:new Date("2021-12-29T09:58:16.200Z"),
    Type:"TRACK_CREATE",
    Event_id: 2
}
const doc6 = {
    Area_id:1,
    TimeSlot:'2021-12-29:11',
    DateIns:new Date("2021-12-29T10:58:16.200Z"),
    Type:"TRACK_CREATE",
    Event_id: 3
}
const doc7 = {
    Area_id:1,
    TimeSlot:'2021-12-29:12',
    DateIns:new Date("2021-12-29T11:58:16.200Z"),
    Type:"TRACK_CREATE",
    Event_id: 4
}
const doc8 = {
  Area_id:1,
  TimeSlot:'2021-12-29:09',
  DateIns:new Date("2021-12-29T08:59:16.200Z"),
  Type:"TRACK_DELETE",
  Event_id: 1
}
const doc9 = {
  Area_id:1,
  TimeSlot:'2021-12-29:10',
  DateIns:new Date("2021-12-29T09:59:16.200Z"),
  Type:"TRACK_DELETE",
  Event_id: 2
}
const doc10 = {
  Area_id:1,
  TimeSlot:'2021-12-29:11',
  DateIns:new Date("2021-12-29T10:59:16.200Z"),
  Type:"TRACK_DELETE",
  Event_id: 3
}
const doc11 = {
  Area_id:1,
  TimeSlot:'2021-12-29:12',
  DateIns:new Date("2021-12-29T11:59:16.200Z"),
  Type:"TRACK_DELETE",
  Event_id: 4
}

const resp = [
  {
    _id: 3,
    positions: [
      {
        X: 1000,
        Y: 1000,
      },
    ],
  },
  {
    _id: 2,
    positions: [
      {
        X: 1000,
        Y: 1000,
      },
    ],
  },
  {
    _id: 4,
    positions: [
      {
        X: 0,
        Y: 1000,
      },
    ],
  },
  {
    _id: 1,
    positions: [
      {
        X: 1000,
        Y: 1000,
      },
    ],
  },
];

describe('Tracks-chart-Controller (e2e)', () => {
  let db: Db;
  let collectionCoordinates;
  let collectionTracks;
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
    await db.createCollection(Collections.coordinates);
    collectionCoordinates = db.collection(Collections.coordinates);
    await db.createCollection(Collections.tracks);
    collectionTracks = db.collection(Collections.tracks);
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
      .post('/tracks/v1/coordinates')
      .send(body);
    expect(result.statusCode).toBe(401);
  });
  it('test1 customer tracks in OneDay', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd042';
    collectionCoordinates.insertMany([doc, doc1, doc2, doc3]);
    collectionTracks.insertMany([doc4, doc5, doc6, doc7, doc8, doc9, doc10, doc11]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode
    });
    await prismaHelpers.prismaAddArea('areaCode1', 1, 'Floor', 'floor.png', -2000, -2000, 4000, 4000);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/tracks/v1/coordinates')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });
});