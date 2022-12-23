import { config as env } from '../config/env';
import { PrismaClient } from '@prisma/client';

console.log(env);

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DB_CONNECTION_STRING,
    },
  },
  log: env.IS_DEV ? ['query'] : [],
});
