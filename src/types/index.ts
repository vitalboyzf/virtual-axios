import CancelToken from '../cancel/CancelToken';
// 请求方法类型
export type Methods = "GET" | "get" | "POST" | "post" | "PUT"
    | "put" | "HEAD" | "head" | "DELETE" | "delete"
    | "OPTIONS" | "options" | "PATCH" | "patch"
// 请求配置接口
export interface IAxiosRequestConfig {
    url?: string
    method?: Methods
    params?: any
    data?: any
    headers?: any
    responseType?: XMLHttpRequestResponseType
    timeout?: number
    transformRequest?: IAxiosTransformer | IAxiosTransformer[]
    transformResponse?: IAxiosTransformer | IAxiosTransformer[]
    cancleToken?: ICancelToken
    xsrfCookieName?: string
    xsrfHeaderName?: string
    onDownloadProgress?: (e: ProgressEvent) => void
    onUploadProgress?: (e: ProgressEvent) => void
    validateStatus?: (status: number) => boolean
    baseURL?: string
    withCredentials?: boolean

    [propsName: string]: any
}
// 响应类型接口
export interface IAxiosResponse<T = any> {
    data: T,
    status: number,
    statusText: string,
    headers: any,
    config: IAxiosRequestConfig,
    request: any
}
// 导出返回结果类型
export interface IAxiosPromise<T = any> extends Promise<IAxiosResponse<T>> {
}
// 错误处理接口
export interface AxiosError extends Error {
    isAxiosError: boolean,
    config: IAxiosRequestConfig,
    code?: string
    request?: any,
    response?: IAxiosResponse
}
export interface Axios {
    defaults: IAxiosRequestConfig
    // 拦截器
    interceptors: {
        request: AxiosInterceptorManager<IAxiosRequestConfig>
        response: AxiosInterceptorManager<IAxiosResponse>
    }
    request<T = any>(config: IAxiosRequestConfig): IAxiosPromise<T>
    get<T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>
    delete<T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>
    head<T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>
    options<T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>
    post<T = any>(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise<T>
    put<T = any>(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise<T>
    patch<T = any>(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise<T>
}
// 这个接口 是两个函数，两种参数类型
export interface IAxiosInstance extends Axios {
    <T = any>(config: IAxiosRequestConfig): IAxiosPromise<T>
    <T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>
}
// 静态接口
export interface IAxiosStatic extends IAxiosInstance {
    create(config?: IAxiosRequestConfig): IAxiosInstance
    CancelToken: ICancelTokenStatic
    Cancel: ICancelStatic
    isCancel: (value: any) => boolean
}

// 拦截器接口
export interface AxiosInterceptorManager<T> {
    use(resolve: ResolveFn<T>, rejected?: RejectedFn): number
    eject(id: number): void
}
export interface ResolveFn<T> {
    (val: T): T | Promise<T>
}
export interface RejectedFn {
    (error: any): any
}
export interface IAxiosTransformer {
    (data: any, headers?: any): any
}
export interface ICancelToken {
    promise: Promise<ICancel>
    reason?: ICancel
    throwIfRequested(): void;
}
export interface ICanceler {
    (message: string): void
}
export interface ICancelExecutor {
    (cancel: ICanceler): void
}
export interface ICancelTokenSource {
    token: ICancelToken,
    cancel: ICanceler
}
export interface ICancelTokenStatic {
    new(executor: ICancelExecutor): CancelToken
    source(): ICancelTokenSource
}
export interface ICancel {
    message?: string;
}
export interface ICancelStatic {
    new(message?: string): any;
}