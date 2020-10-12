import { RejectedFn, ResolveFn } from '../types/index'
// 拦截器
interface Interceptor<T> {
    resolved: ResolveFn<T>
    rejected?: RejectedFn
}
export default class InterceptorManager<T>{
    // 拦截器数组
    private interceptors: Array<Interceptor<T> | null>
    constructor() {
        // 初始化拦截器数组
        this.interceptors = []
    }
    use(resolved: ResolveFn<T>, rejected?: RejectedFn): number {
        // 调用use方法，向拦截器添加一个对象元素，每个对象包含一个或者两个函数
        this.interceptors.push({
            resolved,
            rejected
        })
        // 返回一个数字
        return this.interceptors.length - 1;
    }
    // 取消拦截器方法
    eject(id: number): void {
        // 如果有对应索引，直接将对应元素设置为空
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
    // 遍历拦截器
    forEach(fn: (interceptor: Interceptor<T>) => void) {
        this.interceptors.forEach(interceptor => {
            if (interceptor) {
                fn(interceptor)
            }
        })
    }
}