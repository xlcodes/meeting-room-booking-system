import request from "../utils/request";

export async function loginApi(username: string, password: string) {
    return await request.post('/user/login', {
        username: username,
        password: password,
    })
}