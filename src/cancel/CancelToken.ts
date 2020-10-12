import { ICancelExecutor, ICancelToken, ICancelTokenSource, ICanceler } from './../types/index';
import Cancel from './Cancel'
// resolve() 类型接口
interface IResolvePromise {
  (reason?: Cancel): void
}
export default class CancelToken implements ICancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: ICancelExecutor) {
    // 用于接收resolve函数的引用
    let resolvePromise: IResolvePromise
    // 创建一个promise赋值给this.promise，并将resolve的引用交给resolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve;
    })
    // 执行传入的函数
    /*
    interface ICanceler {
    (message: string): void
    }
    interface ICancelExecutor {
    (cancel: ICanceler): void
    }
   */
    executor(message => {
      if (this.reason) { return }
      // 将cancel对象赋给this.reason this.reason.message = message
      this.reason = new Cancel(message);
      // 将this.reason 结果resolve   (已决)
      resolvePromise(this.reason);
    })
  }
  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason;
    }
  }
  // 静态函数，方便创建cancelToken对象
  /*
 interface ICanceler {
  (message: string): void
  }
 */
  static source(): ICancelTokenSource {
    // cancel函数
    let cancel!: ICanceler
    const token = new CancelToken(c => {
      /*
      这里的c相当于
      message => {
      if (this.reason) { return }
      // 将cancel对象赋给this.reason this.reason.message = message
      this.reason = new Cancel(message);
      // 将this.reason 结果resolve
      resolvePromise(this.reason);
    }
      */
      cancel = c;
    })
    return {
      cancel,
      token
    }
  }
}