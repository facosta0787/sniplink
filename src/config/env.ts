interface IConfig {
  AT_APIKEY: string | undefined;
  AT_TABLEID: string | undefined;
}

export const config: IConfig = {
  AT_APIKEY: process.env.AT_APIKEY,
  AT_TABLEID: process.env.AT_TABLEID,
}