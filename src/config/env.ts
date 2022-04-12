interface IConfig {
  AT_APIKEY: string | undefined;
  AT_TABLEID: string | undefined;
  AT_SHEET: string | undefined;
}

export const config: IConfig = {
  AT_APIKEY: process.env.AT_APIKEY,
  AT_TABLEID: process.env.AT_TABLEID,
  AT_SHEET: process.env.AT_SHEET,
};
