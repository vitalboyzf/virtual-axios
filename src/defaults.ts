import { transformRequest, transformResponse } from './helpers/data';
import { processHeader } from './helpers/headers';
import { IAxiosRequestConfig } from './types/index'
/*
headers:
common: {Accept: "application/json,text/plain}
delete: {}
get: {}
head: {}
options: {}
patch: {Content-type: "application/x-www-form-urlencoded"}
post: {Content-type: "application/x-www-form-urlencoded"}
put: {Content-type: "application/x-www-form-urlencoded"}
__proto__: Object
method: "get"
timeout: 0
 */
const defaults: IAxiosRequestConfig = {
  method: "get",
  timeout: 0,
  headers: {
    common: {
      Accept: "application/json,text/plain,*/*"
    }
  },
  xsrfCookieName: "XSRF-TOKEN-D",
  xsrfHeaderName: "X-XSRF-TOKEN-D",
  transformRequest: [function (data: any, headers: any) {
    processHeader(headers, data);
    return transformRequest(data);
  }],
  transformResponse: [function (data: any) {
    return transformResponse(data);
  }],
  validateStatus(status: number): boolean {
    return status >= 200 && status <= 300;
  }
}
const methodsNoData = ["delete", "get", "head", "options"];
methodsNoData.forEach(method => {
  defaults.headers[method] = {};
})
const methodsWithData = ["post", "put", "patch"];
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    "Content-type": "application/x-www-form-urlencoded"
  }
})
export default defaults;