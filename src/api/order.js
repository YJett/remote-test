import request from '@/utils/request'

export function getOrder(data) {
    return request({
        url: 'http://127.0.0.1:8000/api/order/',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
}
export function myStock() {
    return request({
        url: 'http://127.0.0.1:8000/api/mystock/',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
}
