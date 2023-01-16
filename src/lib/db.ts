import { config as env } from '../../config/env';
import { PrismaClient, Link, Prisma } from '@prisma/client';

interface ILinkCreateParams {
  hash: string;
  link: string;
  alias?: string;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DB_CONNECTION_STRING,
    },
  },
  log: env.IS_DEV ? ['query'] : [],
});

function linkCreate() {
  return {
    create: async function (link: ILinkCreateParams): Promise<Link | null> {
      const created = await prisma.link.create({
        data: {
          hash: link.hash,
          link: link.link,
          alias: link.alias,
        },
      });
      return created;
    },
  };
}

function linkFind() {
  return {
    find: async function (where: Prisma.LinkWhereUniqueInput): Promise<Link | null> {
      const found = await prisma.link.findUnique({
        where,
      });
      return found;
    },
  };
}

function db(): any {
  return {
    conn: prisma,
    link: {
      ...linkCreate(),
      ...linkFind(),
    },
  };
}

export default db();
