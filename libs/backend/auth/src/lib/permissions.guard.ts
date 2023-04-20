import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '@visionarea-admin/common';
import { Claims } from './permissions.enum';

interface UserForPermissions {
  isAdmin: boolean;
  isStoreAdmin: boolean;
  Stores?: number[];
}

const getStores = (id, bStore_id, StoreCompare_id, qStore_id): number[] => {
  if (id) return [parseInt(id)];
  const stores = parseInt(bStore_id) || JSON.parse(qStore_id || '[]');
  const retval = Array.isArray(stores) ? stores : [stores];
  if (StoreCompare_id) retval.push(StoreCompare_id);
  return retval;
};

const getGroups = (Group_id, GroupCompare_id): number[] => {
  const retval = [];
  if (Group_id) retval.push(Group_id);
  if (GroupCompare_id) retval.push(GroupCompare_id);
  return retval;
};

const hasAdminPermission = (user: UserForPermissions) => user.isAdmin;

const hasStoreAdminPermission = (user: UserForPermissions) =>
  user.isStoreAdmin || user.isAdmin;

const hasStoreGroupPermission = (values: number[], user: UserForPermissions, list: string) => {
  if (values.length === 0) return true;
  if (user.isAdmin) return true;
  const diff = values.filter((s) => !user[list].includes(s));
  return diff.length === 0;
};

const hasStorePermission = (values: number[], user: UserForPermissions) => hasStoreGroupPermission(values, user, 'Stores');
const hasGroupPermission = (values: number[], user: UserForPermissions) => hasStoreGroupPermission(values, user, 'StoreGroups');

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );

    const user: AuthUser = context.getArgs()[0].user;

    const request = context.switchToHttp().getRequest();
    const {
      params: { id },
      body: { Store_id: bStore_id, StoreCompare_id, Group_id, GroupCompare_id },
      query: { Store_id: qStore_id },
    } = request;

    if (!routePermissions) {
      return true;
    }

    const hasPermission = () => {
      let result = true;
      let res: boolean;
      routePermissions.forEach((routePermission) => {
        switch (routePermission) {
          case Claims.isAdmin:
            res = hasAdminPermission(user);
            if (!res) result = false;
            break;

          case Claims.isStoreAdmin:
            res = hasStoreAdminPermission(user);
            if (!res) result = false;
            break;

          case Claims.stores:
            res = hasStorePermission(getStores(id, bStore_id, StoreCompare_id, qStore_id), user);
            if (!res) result = false;
            break;

          case Claims.storegroups:
            res = hasGroupPermission(getGroups(Group_id, GroupCompare_id), user);
            if (!res) result = false;
            break;

          default:
            result = false;
        }
      });
      return result;
    };
    return hasPermission();
  }
}
