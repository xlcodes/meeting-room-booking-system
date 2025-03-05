import axios from "axios";
import qs from "qs";
import addRequestInterceptor from "./reqInterceptor.ts";
import addResInterceptor from "./resInterceptor.ts";

const http = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 60 * 1000,
    withCredentials: true,
    paramsSerializer: params => {
        return qs.stringify(params, {arrayFormat: 'indices'})
    }
})

// 添加请求拦截器
addRequestInterceptor(http);

// 添加响应拦截器
addResInterceptor(http);

export default http;