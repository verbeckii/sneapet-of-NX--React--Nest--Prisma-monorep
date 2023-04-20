import Prisma from "prisma";
import { PrismaClient } from '@prisma/client';
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Redis from "ioredis";
import { RedisMemoryOptions } from "prisma-redis-middleware/dist/types";

let cacheMiddleware: Prisma.Middleware;
if (process.env.REDIS_URL) {
  const redis = new Redis(process.env.REDIS_URL);
  cacheMiddleware = createPrismaRedisCache({
    storage: { type: "redis", options: { client: redis, invalidation: { referencesTTL: 15 * 60 } }  as never as RedisMemoryOptions},
    cacheTime: 15 * 60,
  });
}


class MyPrisma {
  private client: PrismaClient;
  private env = process.env.NODE_ENV;

  getClient(): PrismaClient {
    if (!this.client) {
      this.client =
        this.env === 'development'
          ? new PrismaClient({ log: ['query'] })
          : new PrismaClient();
        if (cacheMiddleware) this.client.$use(cacheMiddleware);
    }
    return this.client;
  }
}

const prisma = new MyPrisma();
export { prisma };