import { AppModule } from '../app/app.module';
import {
  testAppSetup,
  prismaHelpers
} from '@visionarea-admin/tests';
import { ApiKeyStrategy } from '@visionarea-admin/auth';
import request from 'supertest';

jest.mock('@visionarea-admin/auth');

const customerCode = 'test_customerCode';
const userCode = 'test_userCode';
const storeCode = ['test_storeCode', 'test1_storeCode'];

const resp = [
  {
    City: 'Milano',
    Description: 'Milano',
    id: 1,
  },
  {
    City: 'Milano',
    Description: 'Milano',
    id: 2,
  },
];

describe('StoresList-Controller (e2e)', () => {
  let apiKeyStrategy: ApiKeyStrategy;
  let mockValidate;

  beforeAll(async () => {
    await testAppSetup.initApp(AppModule);
  });

  beforeEach(async () => {
    await prismaHelpers.resetDb();
  });


  afterEach(async () => {
    await testAppSetup.closeApp();
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

  it('test0 should return 401-unauthorized code if no credentials', async () => {
    const result = await request(testAppSetup.app.getHttpServer())
      .get('/stores/v1/list')
    expect(result.statusCode).toBe(401);
  });

  it('test1 many stores', async () => {
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd032';
    await prismaHelpers.addDbApiKey({
      customerCode,
      userCode,
      apiKey,
      storeCodes: storeCode,
      Description: 'Milano',
      City: 'Milano',
    });
    const response = await request(testAppSetup.app.getHttpServer())
      .get('/stores/v1/list')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toEqual(resp);
  });

});
