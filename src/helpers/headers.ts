import { Methods } from './../types/index';
import { deepMerge, isPlainObject } from './util'
// 转化成大写字母
function normalizedHeaderName(headers: any, normalizeName: string): void {
  if (!headers) return
  // 遍历headers属性，name为headers的每一个属性名
  Object.keys(headers).forEach(name => {
    // 属性值
    const value = headers[name];
    // 如果设置的headers属性不等于传入的normalizeName 但是 都转化为大写，两者相等
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      // 将header的Content-Type 的值设置为name的属性值
      headers[normalizeName] = value
      // 删除headers里的原属性
      delete headers[name]
    }
  })
}
// 设置请求头
export function processHeader(headers: any, data: any): any {
  // 经过这一步 headers里面的如果传的是小写的content-type 就转化为Content-Type
  normalizedHeaderName(headers, 'Content-Type')
  // 判断data是不是平面对象
  if (isPlainObject(data)) {
    // 如果是平面对象，并且headers没有设置Content-Type属性
    if (headers && !headers['Content-Type']) {
      // 将Content-Type设置一个默认属性application/json;charset=utf-8
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  // 返回处理完成的headers
  return headers
}
// 将headers字符串转化为对象
export function parseHeaders(headers: string): any {
  // 创建一个没有原型的对象
  let parsed = Object.create(null)
  if (!headers) {
    // 如果没有headers返回一个空对象
    return parsed
  }
  /*
     date: Fri, 08 Dec 2017 21:04:30 GMT\r\n
     content-encoding: gzip\r\n
     x-content-type-options: nosniff\r\n
     server: meinheld/0.6.1\r\n
     x-frame-options: DENY\r\n
     content-type: text/html; charset=utf-8\r\n
     connection: keep-alive\r\n
     strict-transport-security: max-age=63072000\r\n
     vary: Cookie, Accept-Encoding\r\n
     content-length: 6502\r\n
     x-xss-protection: 1; mode=block\r\n
   */
  // 将headers字符串根据每行转化为数组，循环这个数组，line是每一行headers
  headers.split("\r\n").forEach(line => {
    // 将每一行header字符串根据:转化为数组   content-type: text/html;charset=utf-8
    let [key, value] = line.split(":")
    // [" content-type","text/html;charset=utf-8"]
    // 将key去除空格，都转化为小写
    key = key.trim().toLowerCase();
    if (!key) {
      return
    }
    // 将value去除空格
    if (value) {
      value = value.trim();
    }
    // 将键值对装入parsed对象
    parsed[key] = value
  })
  // 将转化完的结果对象返回
  return parsed
}

export function flattenHeaders(headers: any, method: Methods): any {
  if (!headers) {
    return headers;
  }
  // 将headers.common headers[method] headers进行合并 合并成一个新对象作为headers
  headers = deepMerge(headers.common, headers[method], headers);
  const methodsToDelete = ["delete", "get", "head", "options", "post", "put", "patch", "common"];
  methodsToDelete.forEach(method => {
    delete headers[method];
  })
  return headers;
}