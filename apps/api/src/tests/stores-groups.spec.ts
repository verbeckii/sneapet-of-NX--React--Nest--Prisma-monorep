import { AppModule } from '../app/app.module';
import {
  testAppSetup,
  prismaHelpers,
  mongoDbManager,
} from '@visionarea-admin/tests';
import { ApiKeyStrategy } from '@visionarea-admin/auth';
import request from 'supertest';

jest.mock('@visionarea-admin/auth');

const customerCode = 'test_customerCode';
const userCode = 'test_userCode';
const storeCode = ['test_storeCode', 'test1_storeCode'];

const response1 = [
  {
    description: '',
    id: 2,
    stores: [],
  },
];

const response2 = [
  {
    description: '',
    id: 1,
    stores: [
      {
        Description: null,
        groupStoreId: 1,
        id: 1,
      },
    ],
  },
];

const response3 = [
  {
    description: 'Yoo',
    id: 1,
    stores: [],
  },
];

describe('DeviceStatusController (e2e', () => {
  let apiKeyStrategy: ApiKeyStrategy;
  let mockValidate;

  beforeAll(async () => {
    await mongoDbManager.start();
    await testAppSetup.initApp(AppModule);
  });

  beforeEach(async () => {
    mongoDbManager.cleanup();
    await prismaHelpers.resetDb();
  });

  afterAll(() => mongoDbManager.stop());

  afterEach(async () => {
    testAppSetup.closeApp();
    jest.resetModules();
  });

  jest.setTimeout(100000);
  beforeEach(async () => {
    apiKeyStrategy =
      testAppSetup.moduleFixture.get<ApiKeyStrategy>(ApiKeyStrategy);
    mockValidate = jest.fn().mockImplementation(apiKeyStrategy.validate);
    Object.defineProperty(apiKeyStrategy, 'validate', {
      value: mockValidate,
      configurable: true,
    });
  });

  it('1 create 2 group, delete 1 group, get groups', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd764';
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    const groups = [];
    for (let i = 0; i < 2; i++) {
      const response = await request(testAppSetup.app.getHttpServer())
        .post('/stores/v1/addGroup')
        .send({ Description: '' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${apiKey}`);
      groups.push(response.body);
    }
    expect(groups).toHaveLength(2);

    await request(testAppSetup.app.getHttpServer())
      .delete('/stores/v1/deleteGroup/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    const response = await request(testAppSetup.app.getHttpServer())
      .get('/stores/v1/groups')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(response1);
  });

  it("2 create group assign stores, try to delete this group, then get groups, group shouldn't be deleted", async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd764';
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/addGroup')
      .send({ Description: '' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/addGroupStores')
      .send({ Store_id: 1, Group_id: 1 })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    await request(testAppSetup.app.getHttpServer())
      .delete('/stores/v1/deleteGroup/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    const response = await request(testAppSetup.app.getHttpServer())
      .get('/stores/v1/groups')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(response2);
  });

  it('3 create group assign stores, delete first stores and then group, then get, group should be deleted', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd764';
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/addGroup')
      .send({ Description: '' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/addGroupStores')
      .send({ Store_id: 1, Group_id: 1 })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    await request(testAppSetup.app.getHttpServer())
      .delete('/stores/v1/deleteGroupStores/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    await request(testAppSetup.app.getHttpServer())
      .delete('/stores/v1/deleteGroup/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    const response = await request(testAppSetup.app.getHttpServer())
      .get('/stores/v1/groups')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual([]);
  });

  it('4 create group, update name of group, get group', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd764';
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
    });
    await request(testAppSetup.app.getHttpServer())
      .post('/stores/v1/addGroup')
      .send({ Description: '' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    await request(testAppSetup.app.getHttpServer())
      .put('/stores/v1/updateGroup')
      .send({ id: 1, Description: 'Yoo' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);

    const response = await request(testAppSetup.app.getHttpServer())
      .get('/stores/v1/groups')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(response3);
  });
});
