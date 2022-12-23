export interface IObjectToQueryStringParams {
  [key: string]: string;
}

export function objectToQueryString(params?: IObjectToQueryStringParams) {
  if (!params) return;
  return Object.keys(params)
    .map((key) => key + '=' + params[key])
    .join('&');
}
