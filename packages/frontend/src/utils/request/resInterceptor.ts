import {AxiosInstance, AxiosResponse} from "axios";
import {message} from "antd";

/**
 * 检查响应状态
 * @param response
 */
const checkStatus = (response: AxiosResponse) => {
    if(response.status >= 200 && response.status < 300) {
        return response;
    }

    const errorText = '';
    const error: any = new Error(errorText);
    error.name = response.status.toString();
    error.response = response;
    throw error;
}

/**
 * 检查业务状态
 * @param response
 */
const checkCodes = async (response: AxiosResponse) => {
    const data = response.data;

    if(data.code === 10002 || data.code === 10004) {
        // 如果 code 是 10002 或者 10004，登录失效，弹出重新登录操作
        // TODO: 弹出重新登录操作
    } else if (data.code === -1) {
        // 如果 code 是 -1，表示操作失败，弹出提示
        await message.error(data.message);
    }

    return data;
}

const addResInterceptor = (axiosInstance: AxiosInstance) => {
    // 检查响应状态
    axiosInstance.interceptors.response.use(checkStatus, err => {
        return Promise.reject(err);
    });
    // 检查 code
    axiosInstance.interceptors.response.use(checkCodes, err => {
        return Promise.reject(err);
    });
}

export default addResInterceptor;