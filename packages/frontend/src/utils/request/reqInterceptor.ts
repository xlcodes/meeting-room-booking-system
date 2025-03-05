import axios, {AxiosInstance, InternalAxiosRequestConfig} from "axios";
import {getToken} from '../auth'

const addRequestToken = (options: InternalAxiosRequestConfig) => {
    const tokenMsg = JSON.parse(getToken() || '{}');
    if (tokenMsg && tokenMsg.token && tokenMsg.token !== 'undefined') {
        options.headers['Authorization'] = `Bearer ${tokenMsg.token}`
    }
}

const source: Record<string, any> = {};
const addCancelToken = (options: any) => {
    const url = options.url;
    if (options.useCancel) {
        if (source[url]) {
            // 取消之前的请求
            source[url].cancel();
        }
        // 获取一个cancelToken对象
        const CancelToken = axios.CancelToken;
        source[url] = CancelToken.source();
        options.cancelToken = source[url].token;
    }
}

const addRequestInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use((options: InternalAxiosRequestConfig) => {
        addRequestToken(options);
        addCancelToken(options);
        return options;
    })
}

export default addRequestInterceptor;