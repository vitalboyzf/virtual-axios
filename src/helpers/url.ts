import { isDate, isPlainObject } from './util'

// 转码
// function encode(val: string): string {
//   return encodeURIComponent(val)
//     .replace(/%40/g, '@')
//     .replace(/%3A/ig, ':')
//     .replace(/%24/g, '$')
//     .replace(/%2C/ig, ',')
//     .replace(/%20/g, '+')
//     .replace(/%5B/ig, '[')
//     .replace(/%5D/ig, ']')
// }

// 根据url和params创建新的url
export function buildUrl(url: string, params?: any): string {
  // 如果没有params直接返回原来的url
  if (!params) {
    return url
  }
  // 创建parts数组
  let parts: string[] = []
  // 遍历params对象 { a: 'zf', b: 'ab' } [a,b] key:a b
  Object.keys(params).forEach(key => {
    // value 'zf' 'ab'
    // value是params每一项的值
    const value = params[key]
    // 如果value没有值，直接返回
    if (!value) {
      return
    }
    // 声明values为一个空数组
    let values = []

    // 下面判断语句，将value转化为数组，方便接下来的操作
    // 如果value为一个数组，values就是接下来需要操作的数组
    if (Array.isArray(value)) {
      // 直接将value赋值给values
      values = value
      // 将key加上一个[] a[]
      key += '[]'
    } else {
      // 如果value不是一个数组 values = [value] => values = ["zf"]
      values = [value]
    }
    // 遍历values
    values.forEach(value => {
      // 如果value是一个日期
      if (isDate(value)) {
        value = value.toISOString()
        // 如果value是一个平面对象
      } else if (isPlainObject(value)) {
        // 转化为json字符串
        value = JSON.stringify(value)
      }
      // parts添加元素["a=zf","b=ab"]
      parts.push(`${key}=${value}`)
    })
  })
  // part: [ 'name=zf', 'age=11' ]
  // serializedParams => a=zf&b=ab
  let serializedParams = parts.join('&')
  if (serializedParams) {
    // 如果地址栏参数有hash去除hash
    // 找到hash的索引位值
    const markIndex = url.indexOf('#')
    // 如果找到了
    if (markIndex !== -1) {
      // 截断hash和hash之后的内容
      url = url.slice(0, markIndex)
    }
    // 找到?的位置索引
    const hasQueryIndex = url.indexOf('?');
    // 如果没有?拼接?,如果有?拼接&,再拼接处理好的query
    url += (hasQueryIndex === -1 ? '?' : '&') + serializedParams;
  }
  // 将处理好的url返回
  return url
}

