import { IAxiosRequestConfig, IAxiosResponse } from "../types/index";

export class AxiosError extends Error {
    private isAxiosError: boolean = true
    constructor(
        public message: string,
        private config: IAxiosRequestConfig,
        private code?: string | null,
        private request?: any,
        private response?: IAxiosResponse
    ) {
        super(message)
        // Object.setPrototypeOf(this, AxiosError.prototype)
    }
}
export function createError(
    message: string,
    config: IAxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: IAxiosResponse
) {
    return new AxiosError(message, config, code, request, response)
}