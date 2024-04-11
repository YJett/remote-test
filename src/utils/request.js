import axios from 'axios'
import { Message } from 'view-design'
import router from '@/router'
import { showLoading, closeLoading } from '@/utils/loading'
import { resetTokenAndClearUser } from '@/utils'

let BASE_URL = process.env.NODE_ENV === 'production' ? 'http://202.120.84.249:8081/api/' : '/api/'

const service = axios.create({
    baseURL: BASE_URL,
    timeout: 3000,
    //    baseURL: 'https://bucuo-1391155-1308220348.ap-shanghai.run.tcloudbase.com/api/',

    //    withCredentials: true,
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
