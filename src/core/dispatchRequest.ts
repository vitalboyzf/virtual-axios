import { IAxiosRequestConfig, IAxiosPromise, IAxiosResponse } from '../types/index'
import { flattenHeaders } from '../helpers/headers'
import { buildUrl } from '../helpers/url'
import xhr from './xhr'
import transform from './transform'
import { combineURL, isAbsoluteURL } from '../helpers/util'
// 分发请求
export default function dispatchRequest(config: IAxiosRequestConfig): IAxiosPromise {
    // 处理传入的config对象
    throwIfCancelLationRequested(config);
    processConfig(config)
    return xhr(config).then((res: IAxiosResponse) => {
        // 将响应的data数据解析成对象，再返回
        return transformResponseData(res)
        // 返回响应结果
    })
}
/**
 * 请求前转化配置参数
 * @param config 
 */
function processConfig(config: IAxiosRequestConfig): void {
    // 处理url
    config.url = transformUrl(config)
    // 设置请求data
    config.data = transform(config.data, config.headers, config.transformRequest);
    // 处理header
    // config.headers = transformHeaders(config.headers, config.data)
    // 处理data
    // config.data = transformRequestData(config.data)
    // 拍平headers
    config.headers = flattenHeaders(config.headers, config.method!);
}
/**
 * 根据配置生成url
 * @param config 
 */
function transformUrl(config: IAxiosRequestConfig): string {
    let { url, params, baseURL } = config
    // 如果有baseUrl并且url不是绝对路径，进行合并处理
    if (baseURL && !isAbsoluteURL(url!)) {
        url = combineURL(baseURL, url);
    }
    return buildUrl(url!, params)
}
// 设置响应数据格式
function transformResponseData(res: IAxiosResponse): IAxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformResponse);
    return res;
}
function throwIfCancelLationRequested(config: IAxiosRequestConfig): void {
    if (config.cancleToken) {
        config.cancleToken.throwIfRequested();
    }
}