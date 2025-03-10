import {Button, Form, Input} from "antd";
import './index.scss'
import {loginApi} from "../../api/login.ts";

interface LoginUser {
    username: string,
    password: string,
}

const layout1 = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
}

const layout2 = {
    labelCol: {span: 0},
    wrapperCol: {span: 24},
}

const LoginPage = () => {

    const onFinish = async (value: LoginUser) => {
        const res = await loginApi(value.username, value.password);

        console.log(res, '=== onfinish ===')

    }


    return (
        <div id='login-container'>
            <h1>会议室预订系统</h1>
            <Form
                {...layout1}
                onFinish={onFinish}
                colon={false}
                autoComplete="off"
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{required: true, message: '请输入用户名!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{required: true, message: '请输入密码!'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    {...layout2}
                >
                    <div className='links'>
                        <a href=''>创建账号</a>
                        <a href=''>忘记密码</a>
                    </div>
                </Form.Item>

                <Form.Item
                    {...layout2}
                >
                    <Button className='btn' type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginPage