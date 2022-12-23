interface IConfig {
  AT_APIKEY: string | undefined;
  AT_TABLEID: string | undefined;
  AT_SHEET: string | undefined;
  IS_DEV: boolean;
  DB_CONNECTION_STRING: string | undefined;
  LINK_DOMAIN: string | undefined;
}

export const config: IConfig = {
  IS_DEV: process.env.NODE_ENV !== 'production',
  LINK_DOMAIN: process.env.LINK_DOMAIN,
  AT_APIKEY: process.env.AT_APIKEY,
  AT_TABLEID: process.env.AT_TABLEID,
  AT_SHEET: process.env.AT_SHEET,
  DB_CONNECTION_STRING: process.env.DATABASE_URL,
};
