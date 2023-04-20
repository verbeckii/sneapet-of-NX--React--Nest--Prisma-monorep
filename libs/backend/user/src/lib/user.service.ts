import { generalCombine } from '@visionarea-admin/utils';
import { Injectable } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { AuthUser } from '@visionarea-admin/common';
import { prisma } from '@visionarea-admin/prisma-client';
import { CustomerIndexes, UserIndexes, CustomerParams } from '@visionarea-admin/queries';
import { arrayUnique, Obj, getHiddenIndexes } from '@visionarea-admin/utils';

@Injectable()
export class UserService {
  constructor(
    private readonly CustomerIndexes: CustomerIndexes,
    private readonly UserIndexes: UserIndexes,
    private readonly CustomerParams: CustomerParams,
  ) {}

    async CustomerData(CustomerId: number,UserId: number){
      const UserHiddenIndexes = await this.UserIndexes.qDescription(UserId);
      const listUserHiddenIndexes = UserHiddenIndexes.map(el=>el.Key);
      const defaultHiddenIndexes = await this.CustomerIndexes.qHiddenIndexes(CustomerId);
  
      const HiddenIndexes = arrayUnique(getHiddenIndexes(defaultHiddenIndexes).concat(listUserHiddenIndexes))
      let CustomerParamsData: Obj[] = await this.CustomerParams.qDescription(CustomerId);
      const AlwaysShowIndexes = [];
      CustomerParamsData.forEach(el=>{
        if(el.alwaysShow===1){
          AlwaysShowIndexes.push(el.Index)
        }
      })
      CustomerParamsData = generalCombine(CustomerParamsData,[],'CustomerParams');
      const ObjParams: Obj = {
        indexes: {},
      };
      CustomerParamsData.forEach((el: Obj) => {
        const key = Object.keys(el)[0];
        ObjParams.indexes[key] = el[key];
      });
      return {HiddenIndexes, AlwaysShowIndexes, ObjParams}
    }
 


  async getByApyKey(apikey: string): Promise<AuthUser | null> {
    if (!uuidValidate(apikey)) {
      return null;
    }

    const user = await prisma.getClient().apiKeys.findFirst({
      where: {
        ApiKey: apikey,
        isActive: 1,
        Users: {
          is: { isActive: 1 },
        },
      },
      select: {
        User_code: true,
        Users: {
          select: {
            id: true,
            Nome: true,
            Auth_code: true,
            isAdmin: true,
            isStoreAdmin: true,
            Customer_id: true,
            MapRegion: true,
            Customers: {
              select: {
                StartHour: true,
                EndHour: true,
                Show: true,
                Visitors: true,
                isMall: true,
                showGroup: true,
                showAttendance: true,
                GroupDelta: true,
                showInOut: true,
                showFloors: true,
                ShowMap: true,
                MapRegion: true,
                Stores: {
                  select: {
                    id: true,
                  },
                  where: {
                    isActive: 1
                  },
                },
              },
            },
            UserStores: {
              select: {
                Store_id: true,
                Stores: {
                  select: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }
    const {HiddenIndexes, AlwaysShowIndexes, ObjParams}: Obj = await this.CustomerData(user.Users.Customer_id, user.Users.id);
    const userStores =
      user.Users.UserStores.length > 0
        ? user.Users.UserStores.filter(s => s.Stores.isActive > 0).map((s) => s.Store_id)
        : user.Users.Customers.Stores.map((s) => s.id);
    const userGroups = await this.getGroups(user.Users.id);
    return {
      id: user.Users.id,
      Code: user.User_code,
      Nome: user.Users.Nome,
      isAdmin: user.Users.isAdmin === 1,
      isStoreAdmin: user.Users.isStoreAdmin === 1,
      StartHour: user.Users.Customers.StartHour ? user.Users.Customers.StartHour: 0,
      EndHour: user.Users.Customers.EndHour ? user.Users.Customers.EndHour: 23,
      Show: user.Users.Customers.Show,
      Visitors: user.Users.Customers.Visitors,
      isMall: user.Users.Customers.isMall === 1,
      showGroup: user.Users.Customers.showGroup === 1,
      showAttendance: user.Users.Customers.showAttendance === 1,
      showFloors: user.Users.Customers.showFloors === 1,
      Customer_id: user.Users.Customer_id,
      GroupDelta: user.Users.Customers.GroupDelta,
      AuthCode: user.Users.Auth_code,
      ApiKey: apikey,
      Stores: userStores,
      StoreGroups: userGroups,
      HiddenIndexes: HiddenIndexes,
      AlwaysShowIndexes,
      Params: ObjParams,
      showInOut: user.Users.Customers.showInOut,
      MapRegion: user.Users.MapRegion || user.Users.Customers.MapRegion,
      ShowMap: user.Users.Customers.ShowMap === 1,
    };
  }

  async getByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.getClient().users.findFirst({
      where: { Mail: email, isActive: 1 },
      select: {
        id: true,
        Code: true,
        Nome: true,
        Auth_code: true,
        isAdmin: true,
        isStoreAdmin: true,
        Customer_id: true,
        MapRegion: true,
        Customers: {
          select: {
            StartHour: true,
            EndHour: true,
            Show: true,
            Visitors: true,
            isMall: true,
            showGroup: true,
            showAttendance: true,
            showFloors: true,
            ShowMap: true,
            MapRegion: true,
            GroupDelta: true,
            showInOut: true,
            Stores: {
              select: {
                id: true,
              },
              where: {
                isActive: 1
              },
            },
          },
        },
        UserStores: {
          select: {
            Store_id: true,
            Stores: {
              select: {
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }
    const dbapikey = await prisma.getClient().apiKeys.findFirst({
      select: {
        ApiKey: true
      },
      where: {
        User_code: user.Auth_code || user.Code,
      }})
    const emptyapikey = {
        ApiKey:''
      }
    const apikey = dbapikey ? dbapikey : emptyapikey;
    const {HiddenIndexes, AlwaysShowIndexes, ObjParams}: Obj = await this.CustomerData(user.Customer_id, user.id);
    const userStores =
      user.UserStores.length > 0
        ? user.UserStores.filter(s => s.Stores.isActive > 0).map((s) => s.Store_id)
        : user.Customers.Stores.map((s) => s.id);
    const userGroups = await this.getGroups(user.id);
    return {
      id: user.id,
      Code: user.Code,
      Nome: user.Nome,
      AuthCode: user.Auth_code,
      isAdmin: user.isAdmin === 1,
      isStoreAdmin: user.isStoreAdmin === 1,
      StartHour: user.Customers.StartHour ? user.Customers.StartHour: 0,
      EndHour: user.Customers.EndHour ? user.Customers.EndHour: 23,
      Show: user.Customers.Show,
      Visitors: user.Customers.Visitors,
      isMall: user.Customers.isMall === 1,
      showGroup: user.Customers.showGroup === 1,
      showAttendance: user.Customers.showAttendance === 1,
      showFloors: user.Customers.showFloors === 1,
      Customer_id: user.Customer_id,
      GroupDelta: user.Customers.GroupDelta,
      ApiKey: apikey.ApiKey,
      Stores: userStores,
      StoreGroups: userGroups,
      HiddenIndexes: HiddenIndexes,
      AlwaysShowIndexes,
      Params: ObjParams,
      showInOut: user.Customers.showInOut,
      MapRegion: user.MapRegion || user.Customers.MapRegion,
      ShowMap: user.Customers.ShowMap === 1,
    };
  }

  async getGroups(userId: number): Promise<number[]> {
    const userGroups = await prisma.getClient().groups.findMany({
      select: {
        id: true,
      },
      where: {
        userId,
      }
    });
    return userGroups.map((g) => g.id)
  }
  
}
