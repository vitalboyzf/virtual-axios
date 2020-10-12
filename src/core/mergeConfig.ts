import { deepMerge, isPlainObject } from "../helpers/util";
import { IAxiosRequestConfig } from "../types/index";
const strats = Object.create(null);
// 默认策略 有配置2就用配置2，没有配置2就用配置1
function defaultStrat(val1: any, val2: any): any {
  return val2 !== undefined ? val2 : val1;
}
// 如果有配置2直接用配置2，没有自定义配置就不用管了
function fromVal2Strat(val1: any, val2: any): any {
  if (val2) {
    return val2;
  }
}
// 深度克隆合并
function deepMergeStart(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val2);
  } else if (typeof val2 !== "undefined") {
    return val2;
  } else if (isPlainObject(val1)) {
    return deepMerge(val1);
  } else if (typeof val1 !== "undefined") {
    return val1;
  }
}

// 使用fromVal2Strat策略的属性
const stratKeyFromVal2 = ["url", "params", "data"];
const stratKeydeepMerge = ["headers"];
stratKeyFromVal2.forEach(key => {
  // strats添加属性，这三个属性使用fromVal2Strat这种策略模式
  /*
    strats={
        url:fromVal2Strat,
        params:fromVal2Strat,
        data:fromVal2Strat
  }
  */
  strats[key] = fromVal2Strat;
})
// headers使用 deepMergeStart策略
stratKeydeepMerge.forEach(key => {
  strats[key] = deepMergeStart
})
// 策略模式 合并配置项
export default function mergeConfig(config1: IAxiosRequestConfig, config2?: IAxiosRequestConfig): IAxiosRequestConfig {
  // 如果没有config
  if (!config2) {
    // 设置config2为一个空对象
    config2 = {};
  }
  // 创建一个空对象 config作为合并后的对象
  const config = Object.create(null);

  for (const key in config2) {
    if (Object.prototype.hasOwnProperty.call(config2, key)) {
      // 调用合并函数
      mergeField(key);
    }
  }
  for (const key in config1) {
    if (Object.prototype.hasOwnProperty.call(config1, key)) {
        // 调用合并函数
        mergeField(key);
    }
  }
  function mergeField(key: string): void {
    // 选择合并策略 如果strats有key这个属性，就用这个属性对应的策略，否则使用默认策略
    const strat = strats[key] || defaultStrat;
    // 合并
    config[key] = strat(config1[key], config2![key]);
  }
  // 返回合并完的配置对象
  return config;
}