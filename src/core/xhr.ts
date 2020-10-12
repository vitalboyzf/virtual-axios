import { IAxiosRequestConfig, IAxiosPromise, IAxiosResponse } from '../types/index'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isFromData, isURLSameOrigin } from '../helpers/util'
import cookie from '../helpers/cookie'
// 处理发送请求的具体逻辑
export default function xhr(config: IAxiosRequestConfig): IAxiosPromise {
    // 返回一个promise
    return new Promise((resolve, reject) => {
        // 取出配置对象的各个配置
        const {
            data = null,
            url,
            cancleToken,
            withCredentials,
            method = 'get',
            headers = {},
            xsrfCookieName,
            onDownloadProgress,
            onUploadProgress,
            validateStatus,
            xsrfHeaderName,
            responseType,
            timeout } = config
        // 创建xhr对象
        const xhr = new XMLHttpRequest()
        // 请求方法 请求url 是否异步
        xhr.open(method.toUpperCase(), url!, true);
        configureRequest();
        addEvents();
        processHeaders();
        processCancel();
        // 发送数据
        xhr.send(data)

        function configureRequest() {
            if (responseType) {
                // 如果设置了responseType属性，赋值给xhr的responseType赋值
                xhr.responseType = responseType
            }
            // 配置请求超时时间
            if (timeout) {
                xhr.timeout = timeout
            }
            // 跨域请求携带cookie
            if (withCredentials) {
                xhr.withCredentials = withCredentials;
            }
        }
        function addEvents() {
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return
                if (xhr.status === 0) return
                // 获取请求头json字符串，并转化为对象格式
                // xhr.getAllResponseHeaders()方法获取字符串形式的所有对象
                const responseHeaders = parseHeaders(xhr.getAllResponseHeaders());
                // 获取相应数据,
                const responseData = responseType === 'text' ? xhr.responseText : xhr.response;
                // 响应信息配置
                const response: IAxiosResponse = {
                    data: responseData,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: responseHeaders,
                    config,
                    request: xhr
                }
                // 处理响应信息
                handleResponse(response)
            }
            // 请求错误
            xhr.onerror = function () {
                reject(createError("net error", config, null, xhr))
            }
            // 请求超时
            xhr.ontimeout = function () {
                reject(createError("请求超时", config, 'ECONNABORTED', xhr))
            }
            if (onDownloadProgress) {
                xhr.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                xhr.upload.onprogress = onUploadProgress;
            }
        }
        function processHeaders() {
            if (isFromData(data)) {
                delete headers["Content-Type"];
            }
            // 如果withGredentials为true或者同源状态 并且 xsrfCookieName有值
            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName);
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue;
                }
            }
            Object.keys(headers).forEach(name => {
                // 如果data为null并且请求头headers的属性名为content-type直接删除这个属性,(没有data设置请求头也没用)
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name]
                } else {
                    // 设置请求头
                    xhr.setRequestHeader(name, headers[name])
                }
            })
        }
        function processCancel() {
            // 如果配置了这个属性
            if (cancleToken) {
                // 执行promise 并且取消请求发送，抛出异常原因(什么时候promise已决状态，什么时候执行then)
                cancleToken.promise.then(reason => {
                    xhr.abort();
                    reject(reason);
                })
            }
        }
        /**
         * 处理响应信息函数
         * @param response 
         */
        function handleResponse(response: IAxiosResponse): void {
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response) 
            } else {
                reject(createError("error with status code" + response.status, config, null, xhr, response))
            }
        }
    })
}

