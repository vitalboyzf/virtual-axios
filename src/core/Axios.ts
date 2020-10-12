import { IAxiosRequestConfig, IAxiosPromise, IAxiosInstance, IAxiosResponse, ResolveFn, RejectedFn } from '../types/index'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptorManager'
import mergeConfig from './mergeConfig'
interface Interceptors {
    request: InterceptorManager<IAxiosRequestConfig>
    response: InterceptorManager<IAxiosResponse>
}
interface PromiseChain<T> {
    resolved: ResolveFn<T> | ((config: IAxiosRequestConfig) => IAxiosPromise)
    rejected?: RejectedFn
}
export default class Axios {
    interceptors: Interceptors
    defaults: IAxiosRequestConfig
    constructor(initConfig: IAxiosRequestConfig) {
        this.defaults = initConfig;
        this.interceptors = {
            request: new InterceptorManager<IAxiosRequestConfig>(),
            response: new InterceptorManager<IAxiosResponse>()
        }
    }
    request(url?: any, config?: any): IAxiosPromise {
        if (typeof url === 'string') {
            if (!config) {
                config = {}
            }
            config.url = url
        }
        else {
            config = url
        }
        // 合并配置
        config = mergeConfig(this.defaults, config);
        // 初始化拦截器数组链
        const chain: PromiseChain<any>[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]
        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)
        })
        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })
        let promise = Promise.resolve(config)
        // 如果数组链有元素
        while (chain.length) {
            // 取出第一个元素
            const { resolved, rejected } = chain.shift()!;
            promise = promise.then(resolved, rejected)
        }
        return promise
    }
    // 语法糖
    get(url: string, config?: IAxiosRequestConfig): IAxiosPromise {
        return this.request(Object.assign(config || {}, {
            method: "get",
            url
        }))
    }
    delete(url: string, config?: IAxiosRequestConfig): IAxiosPromise {
        return this.request(Object.assign(config || {}, {
            method: "delete",
            url
        }))
    }
    head(url: string, config?: IAxiosRequestConfig): IAxiosPromise {
        return this.request(Object.assign(config || {}, {
            method: "head",
            url
        }))
    }
    options(url: string, config?: IAxiosRequestConfig): IAxiosPromise {
        return this.request(Object.assign(config || {}, {
            method: "options",
            url
        }))
    }
    post(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise {
        return this.request(Object.assign(config || {}, {
            method: "post",
            url,
            data
        }))
    }
    put(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise {
        return this.request(Object.assign(config || {}, {
            method: "put",
            url,
            data
        }))
    }
    patch(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise {
        return this.request(Object.assign(config || {}, {
            method: "patch",
            url,
            data
        }))
    }
}