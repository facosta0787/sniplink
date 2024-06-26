import { config as env } from 'config/env';
import type { IObjectToQueryStringParams } from '../utils/object-to-query-string';
import { objectToQueryString } from '../utils/object-to-query-string';

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

function fetchLinks(reqconfig: IReqconfig) {
  return {
    getLinks: async function (params?: IObjectToQueryStringParams): Promise<any> {
      const response = await fetch(`${reqconfig.baseURL}/${env.AT_SHEET}?${objectToQueryString(params)}`, {
        headers: new Headers(reqconfig.headers),
      });
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

export default airtable;
