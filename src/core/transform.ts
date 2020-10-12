import { IAxiosTransformer } from './../types/index';
export default function (data: any, headers: any, funcs?: IAxiosTransformer | IAxiosTransformer[]) {
  if (!funcs) {
    return data;
  }
  if (!Array.isArray(funcs)) {
    funcs = [funcs];
  }
  funcs.forEach(func => {
    data = func(data, headers);
  })
  return data;
}