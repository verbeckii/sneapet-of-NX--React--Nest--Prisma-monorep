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
    Y:1000
}
const doc1 = {
    Area_id:1,
    TimeSlot:'2021-12-29:10',
    X:-1000,
    Y:1000
}
const doc2 = {
    Area_id:1,
    TimeSlot:'2021-12-29:11',
    X:-1000,
    Y:1000
}
const doc3 = {
    Area_id:1,
    TimeSlot:'2021-12-29:12',
    X:-2000,
    Y:1000
}

const resp = [
  {
    X: 0,
    Y: 0,
    Z: 0,
  },
  {
    X: 0,
    Y: 1,
    Z: 0,
  },
  {
    X: 0,
    Y: 2,
    Z: 0,
  },
  {
    X: 0,
    Y: 3,
    Z: 1,
  },
  {
    X: 1,
    Y: 0,
    Z: 0,
  },
  {
    X: 1,
    Y: 1,
    Z: 0,
  },
  {
    X: 1,
    Y: 2,
    Z: 0,
  },
  {
    X: 1,
    Y: 3,
    Z: 3,
  },
  {
    X: 2,
    Y: 0,
    Z: 0,
  },
  {
    X: 2,
    Y: 1,
    Z: 0,
  },
  {
    X: 2,
    Y: 2,
    Z: 0,
  },
  {
    X: 2,
    Y: 3,
    Z: 0,
  },
  {
    X: 3,
    Y: 0,
    Z: 0,
  },
  {
    X: 3,
    Y: 1,
    Z: 0,
  },
  {
    X: 3,
    Y: 2,
    Z: 0,
  },
  {
    X: 3,
    Y: 3,
    Z: 0,
  },
];

describe('Attendance_heatmap-Controller (e2e)', () => {
  let db: Db;
  let collectionCoordinates;
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
      .post('/attendance/v1/heatmap')
      .send(body);
    expect(result.statusCode).toBe(401);
  });
  it('test1 Some squares are missing (0 values) but must be inserted in the return array', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd042';
    collectionCoordinates.insertMany([doc, doc1, doc2, doc3]);
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode
    });
    await prismaHelpers.prismaAddArea('areaCode1', 1, 'Floor', 'floor.png', -2000, -2000, 4000, 4000);
    const response = await request(testAppSetup.app.getHttpServer())
      .post('/attendance/v1/heatmap')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });
});