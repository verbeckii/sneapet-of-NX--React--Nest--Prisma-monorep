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

const getStores = (id, bStore_id, qStore_id): number[] => {
  if (id) return [parseInt(id)];
  const stores = bStore_id || JSON.parse(qStore_id || '[]');
  return Array.isArray(stores) ? stores : [stores];
};

const hasAdminPermission = (user: UserForPermissions) => user.isAdmin;

const hasStoreAdminPermission = (user: UserForPermissions) =>
  user.isStoreAdmin || user.isAdmin;

const hasStorePermission = (values: number[], user: UserForPermissions) => {
  if (values.length === 0) return true;
  if (user.isAdmin) return true;
  const diff = values.filter((s) => !user.Stores.includes(s));
  return diff.length === 0;
};

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
      body: { Store_id: bStore_id },
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
            res = hasStorePermission(getStores(id, bStore_id, qStore_id), user);
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
