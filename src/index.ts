import merge from "ramda/es/merge";
import is from "ramda/es/is";
import toString from "ramda/es/toString";

export type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
const ABSOLUTE_URL_REGEX = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

let defaultHeaders = {
  "Content-Type": "application/json; charset=utf-8"
};

export const setHeaders = (headers: any) => merge(defaultHeaders, headers);

const getDefaultHeaders = () => defaultHeaders;

const fetchClient = async <T = any>(url: string, method: FetchMethod = "GET", payload?: any, qp?: any): Promise<T> => {
  let requestUrl = getRequestUrl(process.env.VUE_APP_ROOT_API, url, qp);
  let requestInit = getRequestInit(method, {}, payload);
  let r = await fetch(requestUrl, requestInit);
  if (r.status == 200) {
    let data: T = await r.json();
    return data;
  } else if (r.status == 403) {
    throw new Error("unauthorized");
  } else if (r.status == 204) {
    return null;
  } else {
    let data = await r.json();
    throw new Error(data);
  }
};

const getRequestUrl = function(baseUrl: string, url: string, qp = {}) {
  if (ABSOLUTE_URL_REGEX.test(url)) {
    return url;
  }

  let resultingUrl = (baseUrl || "") + "/" + url;
  let params = toQueryParams(qp);
  return params ? resultingUrl + "?" + params : resultingUrl;
};

const getRequestInit = function(method: FetchMethod, headers: HeadersInit, payload?: any): RequestInit {
  let requestInit: RequestInit = {};
  requestInit.method = method;
  requestInit.headers = merge(getDefaultHeaders(), headers);
  if (payload) requestInit.body = JSON.stringify(payload);
  return requestInit;
};

const toQueryParams = function(queryParams: any, prefix?: any) {
  let str = [],
    p;
  for (p in queryParams) {
    if (queryParams.hasOwnProperty(p)) {
      let k = prefix ? prefix + "[" + p + "]" : p,
        v = queryParams[p];
      str.push(v !== null && typeof v === "object" ? serialize(k, v) : encodeURIComponent(k) + "=" + serializeValue(v));
    }
  }
  return str.join("&");
};

const serialize = function(key: string, value: any) {
  if (is(Array, value)) value = toString(value);
  let serialized = `${key}=${value}`;
  return serialized;
};

const serializeValue = function(value: any) {
  return value === null || typeof value === "undefined" ? "" : encodeURIComponent(value);
};

export default fetchClient;
