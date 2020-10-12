import { IAxiosStatic, IAxiosRequestConfig } from './types/index'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaultsConfig from './defaults'
import mergeConfig from './core/mergeConfig'
import Cancel, { isCancel } from './cancel/Cancel'
import CancelToken from './cancel/CancelToken'
function createInstance(config: IAxiosRequestConfig): IAxiosStatic {
    // 创建axios实例 
    const context = new Axios(config)
    // 创建一个instance 接收 request方法
    const instance = Axios.prototype.request.bind(context)
    // 将Axios原型的方法添加到instance上
    instance.get = context.get.bind(context);
    instance.post = context.post.bind(context);
    instance.head = context.head.bind(context);
    instance.patch = context.patch.bind(context);
    instance.put = context.put.bind(context);
    instance.delete = context.delete.bind(context);
    instance.options = context.options.bind(context);
    // 将实例上的函数复制到instance上
    extend(instance, context)
    // 将实例返回，实例本身就是request方法 方法上添加静态函数
    return instance as IAxiosStatic
}
// 导出instance
const axios = createInstance(defaultsConfig)
axios.create = function (config) {
    return createInstance(mergeConfig(defaultsConfig, config))
}
// 添加静态方法
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;
export default axios