import { config as env } from 'src/config/env';

interface IReqconfig {
  headers: {
    Authorization: string;
    'Content-Type': string;
  };
  baseURL: string;
}

interface ILink {
  uid: string;
  link: string;
  alias?: string | null;
}

interface IAirtable {
  tableid: string | undefined;
  apiurl: string;
  getLinks(params?: IObjectToQueryStringParams): Promise<any>;
  addLink(link: ILink): Promise<any>;
}

function airtable(): IAirtable {
  const config = {
    tableid: env.AT_TABLEID,
    apiurl: 'https://api.airtable.com/v0',
  };

  const reqconfig: IReqconfig = {
    headers: {
      Authorization: `Bearer ${env.AT_APIKEY}`,
      'Content-Type': 'application/json',
    },
    baseURL: `${config.apiurl}/${config.tableid}`,
  };

  return {
    ...config,
    ...fetchLinks(reqconfig),
    ...createLink(reqconfig),
  };
}

function fetchLinks(reqconfig: IReqconfig) {
  return {
    getLinks: async function (
      params?: IObjectToQueryStringParams,
    ): Promise<any> {
      const response = await fetch(
        `${reqconfig.baseURL}/${env.AT_SHEET}?${objectToQueryString(params)}`,
        { headers: new Headers(reqconfig.headers) },
      );
      const data = await response.json();
      return { data };
    },
  };
}

function createLink(reqconfig: IReqconfig) {
  return {
    addLink: async function (link: ILink): Promise<any> {
      const params = {
        records: [{ fields: link }],
      };

      const response = await fetch(`${reqconfig.baseURL}/${env.AT_SHEET}`, {
        headers: new Headers(reqconfig.headers),
        method: 'post',
        body: JSON.stringify(params),
      });
      const data = await response.json();

      return { data };
    },
  };
}

interface IObjectToQueryStringParams {
  [key: string]: string;
}

function objectToQueryString(params?: IObjectToQueryStringParams) {
  if (!params) return;
  return Object.keys(params)
    .map((key) => key + '=' + params[key])
    .join('&');
}

export default airtable;
