import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest'
import { MeController } from '../me/me.controller';
import { AppModule } from '../app/app.module';
import { TokenService } from '@visionarea-admin/token';
import { Token } from '@visionarea-admin/common';
import { CacheStrategy } from '@visionarea-admin/auth';
import { ApiKeyStrategy } from '@visionarea-admin/auth';
import { JwtStrategy } from '@visionarea-admin/auth';
import { prismaHelpers } from '@visionarea-admin/tests';
import { sign as signJwt } from 'jsonwebtoken';
import { testAppSetup } from '@visionarea-admin/tests'

jest.mock('@visionarea-admin/auth');

const resp = {
  id: 1,
  Code: 'test_userCode',
  Nome: null,
  isAdmin: false,
  isStoreAdmin: false,
  StartHour: 0,
  EndHour: 23,
  Show: null,
  Visitors: null,
  isMall: false,
  showGroup: false,
  showAttendance: false,
  Customer_id: 1,
  GroupDelta: 4,
  AuthCode: null,
  ApiKey: 'abda4a94-95d3-47a5-889f-2121212',
  Stores: [],
  HiddenIndexes: [ 'Visits', 'Passersby' ],
  Params: { indexes: {} },
  AlwaysShowIndexes: [],
  showInOut: 'InOut'
}

const resp1 = {
  id: 1,
  Code: 'test_userCode',
  Nome: null,
  isAdmin: false,
  isStoreAdmin: false,
  StartHour: 0,
  EndHour: 23,
  Show: null,
  Visitors: null,
  isMall: false,
  showGroup: false,
  showAttendance: false,
  Customer_id: 1,
  GroupDelta: 4,
  AuthCode: null,
  ApiKey: 'abda4a94-454545-47a5-889f-454545454',
  Stores: [],
  HiddenIndexes: [ 'Visits', 'Groups', 'Passersby' ],
  Params: { indexes: {} },
  AlwaysShowIndexes: [],
  showInOut: 'InOut'
}


describe('MeController',  () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    ({ app, moduleFixture } = await testAppSetup.initApp(AppModule));
  })
  // beforeEach(async () => {
  // });

  afterEach(async () => {
    jest.resetModules();
  })
  afterAll(async () => {
    await testAppSetup.closeApp();
  })
  
  it('should be defined', () => {
    expect(app).toBeDefined();
    const controller = moduleFixture.get<MeController>(MeController);
    expect(controller).toBeDefined();
  });


  describe('Authorization/Authentication Guards -', () => {
    beforeEach(async () => {
      await prismaHelpers.resetDb();
    }, 10000)

    it('should return 401-unauthorized code if no credentials', async () => { 
      const result = await request(app.getHttpServer()).get('/me/v1');
      expect(result.statusCode).toBe(401)
    })

    it('(CacheStrategy) should return 200-ok if jwt in cache', async () => { 
      // Arrange
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      const tokenObj: Token = {
        token: 'key',
        expiry: Date.now() + 30*1000,
        user: {
          id: 1,
          Code: "string",
          isAdmin: true,
          isStoreAdmin: true,
          isMall: true,
          showGroup: true,
          showAttendance: false,
          Customer_id: 1,
          Stores: [1], 
          GroupDelta: 10,
          ApiKey: "",
          HiddenIndexes: [],
          StartHour:0, EndHour:23, AlwaysShowIndexes:[], Params:{},
          showInOut: 'InOut'
        }
      }
      const tokenService = moduleFixture.get<TokenService>(TokenService);
      // This method allows changing private class property
      Object.defineProperty(tokenService, 'cachedTokens', { value: {[token]: tokenObj}, configurable: true })
      // Mock validate function
      const cacheStrategy = moduleFixture.get<CacheStrategy>(CacheStrategy);
      const mockValidate = jest.fn().mockImplementation(cacheStrategy.validate)
      Object.defineProperty(cacheStrategy, 'validate', { value: mockValidate, configurable: true })

      // Act
      const result = await request(app.getHttpServer())
        .get('/me/v1')
        .set('Authorization', 'Bearer ' + token)
        
      // Assert
      expect(mockValidate).toHaveBeenCalledTimes(1);
      expect(result.statusCode).toBe(200);
    })

    it('(CacheStrategy) should return 401-unauthorized if jwt not in cache', async () => { 
      // Arrange
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      const tokenObj: Token = {
        token: 'key',
        expiry: Date.now() + 30*1000,
        user: {
          id: 1,
          Code: "string",
          isAdmin: true,
          isStoreAdmin: true,
          isMall: true,
          showAttendance: false,
          showGroup: true,
          Customer_id: 1,
          Stores: [1], 
          GroupDelta: 10,
          ApiKey: "",
          HiddenIndexes: [],
          StartHour:0, EndHour:23, AlwaysShowIndexes:[], Params:{},
          showInOut: 'InOut'
        }
      }
      const tokenService = moduleFixture.get<TokenService>(TokenService);
      // This method allows changing private class property
      Object.defineProperty(tokenService, 'cachedTokens', { value: {[token]: tokenObj}, configurable: true })
      // Mock validate function
      const cacheStrategy = moduleFixture.get<CacheStrategy>(CacheStrategy);
      const mockValidate = jest.fn().mockImplementation(cacheStrategy.validate)
      Object.defineProperty(cacheStrategy, 'validate', { value: mockValidate, configurable: true })

      // Act
      const result = await request(app.getHttpServer())
        .get('/me/v1')
        .set('Authorization', 'Bearer ' + 'wrong' + token)
        
      // Assert
      expect(mockValidate).toHaveBeenCalledTimes(1);
      expect(result.statusCode).toBe(401);
    })

    it('(ApiKeyStrategy) should return 200-ok if correct apiKey in header', async () => {
      // Arrange
      const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b'
      const customerCode = "test_customerCode";
      const userCode = "test_userCode";
      await addDbApiKey(customerCode, userCode, apiKey);

      // Mock validate function
      const apiKeyStrategy = moduleFixture.get<ApiKeyStrategy>(ApiKeyStrategy);
      const mockValidate = jest.fn().mockImplementation(apiKeyStrategy.validate)
      Object.defineProperty(apiKeyStrategy, 'validate', { value: mockValidate, configurable: true })

      // Act
      const result = await request(app.getHttpServer())
        .get('/me/v1')
        .set('Authorization', `Bearer ${apiKey}`)
        
      // Assert
      expect(mockValidate).toHaveBeenCalledTimes(1);
      expect(result?.statusCode).toBe(200);
    })

    it('(ApiKeyStrategy) should return 401-unauthorized if wrong apiKey in header (api key not in db)', async () => {
      // Arrange
      const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07b'
      const customerCode = "test_customerCode";
      const userCode = "test_userCode";
      await addDbApiKey(customerCode, userCode, apiKey);

      // Mock validate function
      const apiKeyStrategy = moduleFixture.get<ApiKeyStrategy>(ApiKeyStrategy);
      const mockValidate = jest.fn().mockImplementation(apiKeyStrategy.validate)
      Object.defineProperty(apiKeyStrategy, 'validate', { value: mockValidate, configurable: true })

      // Act
      const result = await request(app.getHttpServer())
        .get('/me/v1')
        .set('Authorization', `Bearer wrong ${apiKey}`)
        
      // Assert
      expect(mockValidate).toHaveBeenCalledTimes(1);
      expect(result?.statusCode).toBe(401);
    })

    // it('(JwtStrategy) should return 200-ok if correct jwt in header', async () => {
    //   // Arrange
    //   const secret = 'testKey'
    //   const authCode = 'testAuthCode'
    //   const jwtToken = createAuthToken(secret, authCode);

    //   const customerCode = "test_customerCode";
    //   const userCode = "test_userCode";
    //   await addDbUserwithAuthCode(customerCode, userCode, authCode);

    //   // Mock validate function
    //   const jwtStrategy = moduleFixture.get<JwtStrategy>(JwtStrategy);
    //   const mockValidate = jest.fn().mockImplementation(jwtStrategy.validate)
    //   Object.defineProperty(jwtStrategy, 'validate', { value: mockValidate, configurable: true })

    //   // Act
    //   const result = await request(app.getHttpServer())
    //     .get('/me/v1')
    //     .set('Authorization', 'Bearer ' + jwtToken)

    //   // Assert
    //   expect(mockValidate).toHaveBeenCalledTimes(1);
    //   expect(result?.statusCode).toBe(200);
    // })

    it('(JwtStrategy) should return 200-ok if correct jwt in header', async () => {
      // Arrange
      const secret = 'testKey'
      const mail = 'test@gmail.com'
      const jwtToken = createAuthToken(secret, mail);

      const customerCode = "test_customerCode";
      const userCode = "test_userCode";
      await addDbUserwithEmail(customerCode, userCode, mail);

      // Mock validate function
      const jwtStrategy = moduleFixture.get<JwtStrategy>(JwtStrategy);
      const mockValidate = jest.fn().mockImplementation(jwtStrategy.validate)
      Object.defineProperty(jwtStrategy, 'validate', { value: mockValidate, configurable: true })

      // Act
      const result = await request(app.getHttpServer())
        .get('/me/v1')
        .set('Authorization', 'Bearer ' + jwtToken)

      // Assert
      expect(mockValidate).toHaveBeenCalledTimes(1);
      expect(result?.statusCode).toBe(200);
    })
    

    // it('(JwtStrategy) should return 401-unauthorized if wrong jwt in header', async () => {
    //   // Arrange
    //   const secret = 'testKey'
    //   const authCode = 'testAuthCode'
    //   const jwtToken = createAuthToken(secret, authCode + 'wrong');

    //   const customerCode = "test_customerCode";
    //   const userCode = "test_userCode";
    //   await addDbUserwithAuthCode(customerCode, userCode, authCode);

    //   // Mock validate function
    //   const jwtStrategy = moduleFixture.get<JwtStrategy>(JwtStrategy);
    //   const mockValidate = jest.fn().mockImplementation(jwtStrategy.validate)
    //   Object.defineProperty(jwtStrategy, 'validate', { value: mockValidate, configurable: true })

    //   // Act
    //   const result = await request(app.getHttpServer())
    //     .get('/me/v1')
    //     .set('Authorization', 'Bearer ' + jwtToken)

    //   // Assert
    //   expect(mockValidate).toHaveBeenCalledTimes(1);
    //   expect(result?.statusCode).toBe(401);
    // })

    it('(JwtStrategy) should return 401-unauthorized if wrong jwt in header', async () => {
      // Arrange
      const secret = 'testKey'
      const mail = 'test@gmail.com'
      const jwtToken = createAuthToken(secret, mail+'wrong');

      const customerCode = "test_customerCode";
      const userCode = "test_userCode";
      await addDbUserwithEmail(customerCode, userCode, mail);

      // Mock validate function
      const jwtStrategy = moduleFixture.get<JwtStrategy>(JwtStrategy);
      const mockValidate = jest.fn().mockImplementation(jwtStrategy.validate)
      Object.defineProperty(jwtStrategy, 'validate', { value: mockValidate, configurable: true })

      // Act
      const result = await request(app.getHttpServer())
        .get('/me/v1')
        .set('Authorization', 'Bearer ' + jwtToken)

      // Assert
      expect(mockValidate).toHaveBeenCalledTimes(1);
      expect(result?.statusCode).toBe(401);
    })
    
    // Create apiKey for user
    async function addDbApiKey(customerCode, userCode, apiKey) {
      const customer = await prismaHelpers.prismaAddClient({customerCode});
      await prismaHelpers.prismaAddUser(userCode, customer.id);
      await prismaHelpers.prismaAddApiKey(userCode, apiKey);
    }

    // async function addDbUserwithAuthCode(customerCode, userCode, authCode) {
    //   const customer = await prismaHelpers.prismaAddClient({customerCode});
    //   await prismaHelpers.prismaAddUser(userCode, customer.id, authCode);
    // }

    async function addDbUserwithEmail(customerCode, userCode, mail) {
      const customer = await prismaHelpers.prismaAddClient({customerCode});
      await prismaHelpers.prismaAddUserWithMail(userCode, customer.id, mail);
    }

    // const createAuthToken = (secret, authCode) => {
    //   const body = { 
    //     sub: authCode,
    //     type: "user",
    //     id: "userId",
    //   };
    //   const signedToken = signJwt(body, secret);
    //   return signedToken
    // };

    const createAuthToken = (secret, email) => {
      const body = { 
        'https://visionarea.net/email':email,
        type: "user",
        id: "userId",
      };
      const signedToken = signJwt(body, secret);
      return signedToken
    };

  })
  describe('HiddenIndexes -', () => {
    beforeEach(async () => {
      await prismaHelpers.resetDb();
    }, 10000)

  it('(HiddenIndexes) add hidden indexes for customer and user', async () => {
    // Arrange
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07c'
    const customerCode = "test_customerCode";
    const userCode = "test_userCode";
    const customer = await prismaHelpers.prismaAddClient({customerCode});
    const user = await prismaHelpers.prismaAddUser(userCode, customer.id);
    await prismaHelpers.prismaAddApiKey(userCode, apiKey);
    await prismaHelpers.prismaAddCustomerHiddenIndexes(customer.id, 'Visits');
    await prismaHelpers.prismaAddUserHiddenIndexes(user.id, 'Passersby');

    // Mock validate function
    const apiKeyStrategy = moduleFixture.get<ApiKeyStrategy>(ApiKeyStrategy);
    const mockValidate = jest.fn().mockImplementation(apiKeyStrategy.validate)
    Object.defineProperty(apiKeyStrategy, 'validate', { value: mockValidate, configurable: true })

    // Act
    const result = await request(app.getHttpServer())
      .get('/me/v1')
      .set('Authorization', `Bearer ${apiKey}`)
    // Assert
   expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(result?.statusCode).toBe(200);
    expect(result.body).toEqual(resp);
  })

  it('(HiddenIndexes) add hidden indexes for customer and user and default(1 id)', async () => {
    // Arrange
    const apiKey = 'abda4a94-95d3-47a5-889f-03b9f96fd07d'
    const customerCode = "test_customerCode";
    const userCode = "test_userCode";
    const customer = await prismaHelpers.prismaAddClient({customerCode});
    const user = await prismaHelpers.prismaAddUser(userCode, customer.id);
    await prismaHelpers.prismaAddApiKey(userCode, apiKey);
    await prismaHelpers.prismaAddCustomerHiddenIndexes(customer.id, 'Visits');
    await prismaHelpers.prismaAddUserHiddenIndexes(user.id, 'Passersby');
    await prismaHelpers.prismaAddCustomerHiddenIndexes(1, 'Groups');

 //   Mock validate function
    const apiKeyStrategy = moduleFixture.get<ApiKeyStrategy>(ApiKeyStrategy);
    const mockValidate = jest.fn().mockImplementation(apiKeyStrategy.validate)
    Object.defineProperty(apiKeyStrategy, 'validate', { value: mockValidate, configurable: true })

    // // Act
    const result = await request(app.getHttpServer())
      .get('/me/v1')
      .set('Authorization', `Bearer ${apiKey}`)
      console.log(result.body);
    // Assert
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(result?.statusCode).toBe(200);
    expect(result.body).toEqual(resp1);
  })
})
})