import request from '@/utils/request'

export function getToken(data) {
    return request({
        url: 'users/login',
        method: 'POST',
        data: {
            username: data.username,
            password: data.password,
        },
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
}
export function getInfo(data) {
    return request({
        url: 'Account/userinfo',
        method: 'GET',
    })
}
