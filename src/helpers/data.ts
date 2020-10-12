import { isPlainObject } from './util'

// 请求body转化函数
export function transformRequest(data: any): any {
  // 如果data是平面对象
  if (isPlainObject(data)) {
    // 返回json字符串格式的data
    return JSON.stringify(data)
  }
  // 否则直接返回data
  return data
}
// 处理响应结果
export function transformResponse(data: any): any {
  // 如果响应数据是JSON字符串格式
  if (typeof data === 'string') {
    try {
      // 将JSON字符串解析成对象
      data = JSON.parse(data)
    } catch (error) {
      console.log(error)
    }
  }
  return data
}