
import axios from 'axios'
import { Message } from 'view-design'
import { Notification, MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import router from '@/router'
import { showLoading, closeLoading } from '@/utils/loading'
import { resetTokenAndClearUser } from '@/utils'

const queue = [] // 请求队列
// let BASE_URL = process.env.NODE_ENV === 'production' ? 'http://202.120.84.249:8081/api/' : '/api/'
let BASE_URL = '/api/'
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,BASE_URL,
    timeout: 10 * 60 * 1000,
    //    baseURL: 'https://bucuo-1391155-1308220348.ap-shanghai.run.tcloudbase.com/api/',

    //    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
})

service.interceptors.request.use(
    (config) => {
        showLoading()
        if (localStorage.getItem('token')) {
            //        config.headers.Authorization = localStorage.getItem('token')
            config.headers.token = localStorage.getItem('token')
        }
        return config
    },
    (error) => Promise.reject(error)
)

service.interceptors.response.use(
    (response) => {
        //    console.log(response)
        closeLoading()
        const res = response.data
        // 这里是接口处理的一个示范，可以根据自己的项目需求更改
        // 错误处理
        if (response.code !== 0 && response.msg) {
            Message.error({
                content: response.msg,
            })
            return Promise.reject()
        }
        // 如果接口正常，直接返回数据
        return res
    },
    (error) => {
        closeLoading()
        let code = error.response.status
        console.log(error.response)
        Message.error({
            content: error.response.data.msg,
            duration: 3,
        })
        // token 无效，清空路由，退出登录
        if (code == 401) {
            resetTokenAndClearUser()
            router.push('login')
        }
        return Promise.reject(error)
    }
)

export default service

const queue = [] // 请求队列
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.VUE_APP_BASE_API,
    // 超时
    timeout: 10 * 60 * 1000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
});
// 取消重复请求
const removeRepeatRequest = config => {
    for (const key in queue) {
        const index = +key
        const item = queue[key]

        if (
            item.url === config.url &&
            item.method === config.method &&
            JSON.stringify(item.params) === JSON.stringify(config.params) &&
            JSON.stringify(item.data) === JSON.stringify(config.data)
        ) {
            // 执行取消操作
            item.cancel('操作太频繁，请稍后再试')
            queue.splice(index, 1)
        }
    }
}
// request拦截器
service.interceptors.request.use(
    config => {
        // 是否需要设置 token
        const isToken = (config.headers || {}).isToken === false;
        if (getToken() && !isToken) {
            config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config;
    },
    error => {
        console.log(error);
        Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    res => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode["default"];
        if (code === 401) {
            MessageBox.confirm(
                "登录状态已过期，您可以继续留在该页面，或者重新登录",
                "系统提示",
                {
                    confirmButtonText: "重新登录",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).then(() => {
                store.dispatch("LogOut").then(() => {
                    location.href = "/index";
                });
            });
        } else if (code === 500) {
            Message({
                message: msg,
                type: "error"
            });
            return Promise.reject(new Error(msg));
        } else if (code !== 200) {
            Notification.error({
                title: msg
            });
            return Promise.reject("error");
        } else {
            return res.data;
        }
    },
    error => {
        console.log("err" + error);
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        Message({
            message: message,
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;
