import { AppModule } from '../app/app.module';
import { testAppSetup, prismaHelpers, mongoDbManager } from '@visionarea-admin/tests';
import { ApiKeyStrategy } from '@visionarea-admin/auth';
import request from 'supertest';
import { Db } from 'mongodb';
import { DeviceStatusDTO } from '@visionarea-admin/utils';
import { sub } from 'date-fns';


jest.mock('@visionarea-admin/auth');

const apiKey = 'abda4a94-95d3-47a5-889f-12121212';
const customerCode = 'test_customerCode';
const userCode = 'test_userCode';
const storeCode = 'test_store';
const areaCode = 'test_area';
const deviceCode = 'test_deviceCode';
const deviceCode2 = 'test_deviceCode2';
const disabledCode = 'DIS001';
const deviceDesc = 'description';

const connectedDeviceResponse: DeviceStatusDTO = [{
    Code: deviceCode,
    Description: deviceDesc,
    Store_id: 1,
    Device_id: 1,
    isConnected: true
}];
const connectedDevicesResponse: DeviceStatusDTO = [{
    Code: deviceCode,
    Description: deviceDesc,
    Store_id: 1,
    Device_id: 1,
    isConnected: true
},{
    Code: deviceCode2,
    Description: deviceDesc,
    Store_id: 1,
    Device_id: 2,
    isConnected: true
}];
const disconnectedDeviceResponse: DeviceStatusDTO = [{
    Code: deviceCode,
    Description: deviceDesc,
    Store_id: 1,
    Device_id: 1,
    isConnected: false
}];

describe('DeviceStatusController (e2e', () => {
    let db: Db;
    let collectionDevices;
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
      db = mongoDbManager.getDb();
      await db.createCollection('devices');
      collectionDevices = db.collection('devices');
  
      apiKeyStrategy = testAppSetup.moduleFixture.get<ApiKeyStrategy>(ApiKeyStrategy);
      mockValidate = jest.fn().mockImplementation(apiKeyStrategy.validate);
      Object.defineProperty(apiKeyStrategy, 'validate', {
        value: mockValidate,
        configurable: true,
      });
    });

    it('returns one connected device', async () => {
        const [doc] = connectedDevices();
        await collectionDevices.insertOne(doc);
    
        await prismaHelpers.addDbApiKey({customerCode, userCode, apiKey, storeCodes:[storeCode]});
        await prismaHelpers.prismaAddArea(areaCode, 1);
        await prismaHelpers.prismaAddDevice(deviceCode, '3D', 'Europe/Rome', 1, 1, 1, deviceDesc);

        const response = await request(testAppSetup.app.getHttpServer())
          .get('/devices/v1/status/1')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${apiKey}`);
        expect(response.body).toEqual(connectedDeviceResponse);
      });
    
    it('returns two connected devices', async () => {
    const docs = connectedDevices();
    await collectionDevices.insertMany(docs);

    await prismaHelpers.addDbApiKey({customerCode, userCode, apiKey, storeCodes:[storeCode]});
    await prismaHelpers.prismaAddArea(areaCode, 1);
    await prismaHelpers.prismaAddDevice(deviceCode, '3D', 'Europe/Rome', 1, 1, 1, deviceDesc);
    await prismaHelpers.prismaAddDevice(deviceCode2, '3D', 'Europe/Rome', 1, 1, 1, deviceDesc);

    const response = await request(testAppSetup.app.getHttpServer())
        .get('/devices/v1/status/1')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${apiKey}`);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(connectedDevicesResponse);
    });
    
    it('returns one disconnected device', async () => {
        const [doc] = connectedDevices();
        doc.DateIns = sub(new Date(), { days: 1 });
        await collectionDevices.insertOne(doc);
    
        await prismaHelpers.addDbApiKey({customerCode, userCode, apiKey, storeCodes:[storeCode]});
        await prismaHelpers.prismaAddArea(areaCode, 1);
        await prismaHelpers.prismaAddDevice(deviceCode, '3D', 'Europe/Rome', 1, 1, 1, deviceDesc);

    
        const response = await request(testAppSetup.app.getHttpServer())
          .get('/devices/v1/status/1')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${apiKey}`);
        expect(response.body).toEqual(disconnectedDeviceResponse);
    });

    it('skips a disabled device', async () => {
        const docs = connectedDevices();
        docs[1].DateIns = sub(new Date(), { days: 1 });
        await collectionDevices.insertMany(docs);
    
        await prismaHelpers.addDbApiKey({customerCode, userCode, apiKey, storeCodes:[storeCode]});
        await prismaHelpers.prismaAddArea(areaCode, 1);
        await prismaHelpers.prismaAddDevice(deviceCode, '3D', 'Europe/Rome', 1, 1, 1, deviceDesc);
        await prismaHelpers.prismaAddDevice(disabledCode, '3D', 'Europe/Rome', 1, 1, 1, deviceDesc);
    
        const response = await request(testAppSetup.app.getHttpServer())
            .get('/devices/v1/status/1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${apiKey}`);
        expect(response.body).toHaveLength(1);
    });    
});

const connectedDevices = () => {
    const now = new Date();
    const doc1 = {
      Customer_id: 1,
      Store_id: 1,
      Device_id: 1,
      DateIns: now
    };
    const doc2 = {
        Customer_id: 1,
        Store_id: 1,
        Device_id: 2,
        DateIns: now
    }
    return [doc1, doc2];
};
