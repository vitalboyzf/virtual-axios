export function isDate(obj: any): obj is Date {
  return Object.prototype.toString.call(obj) === '[object Date]'
}

// export function isObject(obj: any): obj is Object {
//   return obj !== null && typeof obj === 'object'
// }

// export function isPlainObject(obj: any): obj is Object {
//   if (typeof obj !== 'object' || obj === null) return false
//   let proto = obj
//   while (Object.getPrototypeOf(proto) !== null) {
//     // 寻找到原型链顶端，最终proto = Object.prototype
//     proto = Object.getPrototypeOf(proto)
//   }
//   // 判断传入obj的原型链上层是否只有一层
//   return Object.getPrototypeOf(obj) === proto
// }
export function isPlainObject(obj: any): obj is Object {
  return toString.call(obj) === "[object Object]"
}
// 判断是否是formData
export function isFromData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData;
}
// 判断是否是绝对路径 (以http://开头)
export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

// 合并路径
export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + "/" + relativeURL.replace(/^\/+/, '') : baseURL;
}
// 对象继承
export function extend<T, F>(to: T, from: F): T & F {
  // 循环原始对象
  for (const key in from) {
    // 将原始对象对应的属性值克隆到目标对象中
    (to as T & F)[key] = from[key] as any
  }
  // 返回目标对象
  return to as T & F
}

// 深合并
export function deepMerge(...objs: any[]): any {
  // 创建一个新对象，作为合并后的对象
  const result = Object.create(null);
  // 循环参数数组，每个元素是需要合并的对象
  objs.forEach(obj => {
    // 如果obj有值
    if (obj) {
      // 循环obj对象key值数组
      Object.keys(obj).forEach(key => {
        // 每一个key值对应的value值
        const val = obj[key];
        // 如果val值是对象
        if (isPlainObject(val)) {
          // 如果result已经有这个key并且这个key值是一个平面对象 (多个对象拥有相同的key)
          if (isPlainObject(result[key])) {
            // 递归调用
            result[key] = deepMerge(result[key], val);
          } else {
            result[key] = deepMerge(val);
          }
        }
        // val值不是对象,基本数据类型
        else {
          // 直接将val赋值给result
          result[key] = val;
        }
      })
    }
  })
  // 返回合并结果
  return result;
}
interface URLOrigin {
  protocol: string
  host: string
}

const urlParsingNode = document.createElement("a");
const currentOrigin = resolveURL(window.location.href);
// 判断传入url和当前窗口url是否同源
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL);
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host);
}

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute("href", url);
  const { protocol, host } = urlParsingNode;
  return {
    protocol,
    host
  }
}

